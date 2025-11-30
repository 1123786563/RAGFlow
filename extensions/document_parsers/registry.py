"""
文档解析器注册模块

该模块提供文档解析器的注册和发现机制，允许动态注册和获取文档解析器。
"""

from typing import Dict, Type, List
from .base import BaseDocumentParser


class DocumentParserRegistry:
    """文档解析器注册表"""
    
    _parsers: Dict[str, Type[BaseDocumentParser]] = {}
    _instances: Dict[str, BaseDocumentParser] = {}
    
    @classmethod
    def register(cls, name: str, parser_class: Type[BaseDocumentParser]):
        """
        注册文档解析器
        
        Args:
            name: 解析器名称
            parser_class: 解析器类
        """
        if not issubclass(parser_class, BaseDocumentParser):
            raise ValueError(f"Parser class must inherit from BaseDocumentParser")
        
        cls._parsers[name] = parser_class
    
    @classmethod
    def get_parser(cls, name: str, config: Dict = None) -> BaseDocumentParser:
        """
        获取文档解析器实例
        
        Args:
            name: 解析器名称
            config: 解析器配置
            
        Returns:
            BaseDocumentParser: 解析器实例
        """
        if name not in cls._parsers:
            raise ValueError(f"Unknown parser: {name}")
        
        # 使用配置作为缓存键的一部分
        cache_key = f"{name}_{hash(str(config))}" if config else name
        
        if cache_key not in cls._instances:
            parser_class = cls._parsers[name]
            cls._instances[cache_key] = parser_class(config)
        
        return cls._instances[cache_key]
    
    @classmethod
    def list_parsers(cls) -> Dict[str, Type[BaseDocumentParser]]:
        """
        列出所有注册的解析器
        
        Returns:
            Dict[str, Type[BaseDocumentParser]]: 解析器名称到类的映射
        """
        return cls._parsers.copy()
    
    @classmethod
    def get_parser_names(cls) -> List[str]:
        """
        获取所有解析器名称
        
        Returns:
            List[str]: 解析器名称列表
        """
        return list(cls._parsers.keys())
    
    @classmethod
    def unregister(cls, name: str):
        """
        注销文档解析器
        
        Args:
            name: 解析器名称
        """
        if name in cls._parsers:
            del cls._parsers[name]
        
        # 清理相关实例
        keys_to_remove = [key for key in cls._instances.keys() if key.startswith(name)]
        for key in keys_to_remove:
            del cls._instances[key]
    
    @classmethod
    def clear(cls):
        """清空所有注册的解析器"""
        cls._parsers.clear()
        cls._instances.clear()
    
    @classmethod
    def get_parser_for_file(cls, file_extension: str, config: Dict = None) -> BaseDocumentParser:
        """
        根据文件扩展名获取合适的解析器
        
        Args:
            file_extension: 文件扩展名，如".pdf"、".docx"等
            config: 解析器配置
            
        Returns:
            BaseDocumentParser: 合适的解析器实例
            
        Raises:
            ValueError: 如果没有找到支持该文件类型的解析器
        """
        for name, parser_class in cls._parsers.items():
            # 创建临时实例检查是否支持该文件类型
            temp_instance = parser_class()
            if temp_instance.supports(file_extension):
                return cls.get_parser(name, config)
        
        raise ValueError(f"No parser found for file extension: {file_extension}")


def register_parser(name: str):
    """
    装饰器：自动注册文档解析器
    
    Args:
        name: 解析器名称
        
    Returns:
        装饰器函数
    """
    def decorator(parser_class: Type[BaseDocumentParser]):
        DocumentParserRegistry.register(name, parser_class)
        return parser_class
    return decorator