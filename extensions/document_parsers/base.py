"""
文档解析器基类模块

该模块定义了文档解析器的基类，所有自定义文档解析器都应该继承此基类。
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional


class BaseDocumentParser(ABC):
    """文档解析器基类"""
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        初始化文档解析器
        
        Args:
            config: 解析器配置参数
        """
        self.config = config or {}
    
    @abstractmethod
    def parse(self, file_path: str, **kwargs) -> Dict[str, Any]:
        """
        解析文档文件
        
        Args:
            file_path: 文档文件路径
            **kwargs: 其他解析参数
            
        Returns:
            Dict[str, Any]: 解析结果，包含内容和元数据
        """
        pass
    
    @abstractmethod
    def supports(self, file_extension: str) -> bool:
        """
        检查是否支持指定的文件类型
        
        Args:
            file_extension: 文件扩展名，如".pdf"、".docx"等
            
        Returns:
            bool: 是否支持该文件类型
        """
        pass
    
    def get_parser_name(self) -> str:
        """
        获取解析器名称
        
        Returns:
            str: 解析器名称
        """
        return self.__class__.__name__
    
    def get_parser_version(self) -> str:
        """
        获取解析器版本
        
        Returns:
            str: 解析器版本
        """
        return "1.0.0"
    
    def validate_config(self) -> bool:
        """
        验证解析器配置
        
        Returns:
            bool: 配置是否有效
        """
        return True
    
    def get_config_schema(self) -> Dict[str, Any]:
        """
        获取配置模式
        
        Returns:
            Dict[str, Any]: 配置模式定义
        """
        return {
            "type": "object",
            "properties": {},
            "required": []
        }
    
    def preprocess(self, file_path: str, **kwargs) -> str:
        """
        预处理文档文件
        
        Args:
            file_path: 文档文件路径
            **kwargs: 其他预处理参数
            
        Returns:
            str: 预处理后的文件路径
        """
        return file_path
    
    def postprocess(self, parsed_result: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        """
        后处理解析结果
        
        Args:
            parsed_result: 原始解析结果
            **kwargs: 其他后处理参数
            
        Returns:
            Dict[str, Any]: 后处理后的解析结果
        """
        return parsed_result
    
    def extract_metadata(self, file_path: str, **kwargs) -> Dict[str, Any]:
        """
        提取文档元数据
        
        Args:
            file_path: 文档文件路径
            **kwargs: 其他元数据提取参数
            
        Returns:
            Dict[str, Any]: 文档元数据
        """
        import os
        from datetime import datetime
        
        stat = os.stat(file_path)
        return {
            "file_name": os.path.basename(file_path),
            "file_path": file_path,
            "file_size": stat.st_size,
            "created_time": datetime.fromtimestamp(stat.st_ctime).isoformat(),
            "modified_time": datetime.fromtimestamp(stat.st_mtime).isoformat(),
            "parser_name": self.get_parser_name(),
            "parser_version": self.get_parser_version()
        }