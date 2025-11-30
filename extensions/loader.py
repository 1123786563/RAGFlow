"""
扩展点加载器模块

该模块负责加载和管理RAGFlow系统的所有扩展点，包括文档解析器、LLM提供商、
嵌入模型等类型的扩展点。
"""

import importlib
import os
import sys
from typing import Dict, List, Any, Optional

from .config import extensions_config


class ExtensionsLoader:
    """扩展点加载器类"""
    
    def __init__(self, extensions_dir: str = None):
        """
        初始化扩展点加载器
        
        Args:
            extensions_dir: 扩展点目录路径，默认为当前模块所在目录
        """
        self.extensions_dir = extensions_dir or os.path.dirname(os.path.abspath(__file__))
        self.loaded_extensions = {}
        self.extension_types = [
            "document_parsers",
            "llm_providers",
            "embedding_models",
            "agent_components",
            "api_endpoints",
            "data_sources",
            "storage_adapters"
        ]
    
    def load_extensions(self):
        """加载所有启用的扩展点"""
        for ext_type in self.extension_types:
            if extensions_config.is_enabled(ext_type):
                self._load_extension_type(ext_type)
    
    def _load_extension_type(self, extension_type: str):
        """
        加载特定类型的扩展点
        
        Args:
            extension_type: 扩展点类型，如"document_parsers"
        """
        ext_dir = os.path.join(self.extensions_dir, extension_type)
        if not os.path.exists(ext_dir):
            print(f"Extension directory not found: {ext_dir}")
            return
        
        try:
            # 加载基础模块
            base_module = importlib.import_module(f"extensions.{extension_type}.base")
            
            # 加载注册模块
            registry_module = importlib.import_module(f"extensions.{extension_type}.registry")
            
            # 加载示例扩展
            self._load_example_extensions(extension_type)
            
            # 加载自定义扩展
            self._load_custom_extensions(extension_type)
            
            self.loaded_extensions[extension_type] = {
                "base": base_module,
                "registry": registry_module
            }
            
            print(f"Successfully loaded extension type: {extension_type}")
            
        except Exception as e:
            print(f"Failed to load extension type {extension_type}: {e}")
            import traceback
            traceback.print_exc()
    
    def _load_example_extensions(self, extension_type: str):
        """
        加载示例扩展
        
        Args:
            extension_type: 扩展点类型，如"document_parsers"
        """
        examples_dir = os.path.join(self.extensions_dir, extension_type, "examples")
        if not os.path.exists(examples_dir):
            return
        
        for file_name in os.listdir(examples_dir):
            if file_name.endswith(".py") and not file_name.startswith("__"):
                module_name = file_name[:-3]
                try:
                    importlib.import_module(f"extensions.{extension_type}.examples.{module_name}")
                except Exception as e:
                    print(f"Failed to load example extension {extension_type}.{module_name}: {e}")
    
    def _load_custom_extensions(self, extension_type: str):
        """
        加载自定义扩展
        
        Args:
            extension_type: 扩展点类型，如"document_parsers"
        """
        custom_extensions = extensions_config.get_custom_extensions(extension_type)
        for ext_name in custom_extensions:
            try:
                importlib.import_module(f"extensions.{extension_type}.{ext_name}")
            except Exception as e:
                print(f"Failed to load custom extension {extension_type}.{ext_name}: {e}")
    
    def get_extension_registry(self, extension_type: str):
        """
        获取扩展点注册表
        
        Args:
            extension_type: 扩展点类型，如"document_parsers"
            
        Returns:
            扩展点注册表对象，如果不存在则返回None
        """
        if extension_type in self.loaded_extensions:
            return self.loaded_extensions[extension_type]["registry"]
        return None
    
    def get_extension_base(self, extension_type: str):
        """
        获取扩展点基类模块
        
        Args:
            extension_type: 扩展点类型，如"document_parsers"
            
        Returns:
            扩展点基类模块，如果不存在则返回None
        """
        if extension_type in self.loaded_extensions:
            return self.loaded_extensions[extension_type]["base"]
        return None
    
    def reload_extension_type(self, extension_type: str):
        """
        重新加载特定类型的扩展点
        
        Args:
            extension_type: 扩展点类型，如"document_parsers"
        """
        if extension_type in self.loaded_extensions:
            del self.loaded_extensions[extension_type]
        
        if extensions_config.is_enabled(extension_type):
            self._load_extension_type(extension_type)
    
    def reload_all_extensions(self):
        """重新加载所有扩展点"""
        self.loaded_extensions = {}
        self.load_extensions()
    
    def list_loaded_extensions(self) -> List[str]:
        """
        列出已加载的扩展点类型
        
        Returns:
            List[str]: 已加载的扩展点类型列表
        """
        return list(self.loaded_extensions.keys())
    
    def is_extension_type_loaded(self, extension_type: str) -> bool:
        """
        检查扩展点类型是否已加载
        
        Args:
            extension_type: 扩展点类型，如"document_parsers"
            
        Returns:
            bool: 是否已加载
        """
        return extension_type in self.loaded_extensions


# 全局扩展点加载器实例
extensions_loader = ExtensionsLoader()