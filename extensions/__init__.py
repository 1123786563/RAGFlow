"""
RAGFlow扩展点模块

该模块提供RAGFlow系统的扩展点功能，允许开发者在不修改主代码的情况下
添加自定义功能，如文档解析器、LLM提供商、嵌入模型等。

使用方法:
    from extensions import extensions_loader
    
    # 加载所有扩展点
    extensions_loader.load_extensions()
    
    # 获取特定类型的扩展点注册表
    parser_registry = extensions_loader.get_extension_registry("document_parsers")
"""

from .loader import ExtensionsLoader
from .config import ExtensionsConfig

# 创建全局扩展点加载器实例
extensions_loader = ExtensionsLoader()

# 创建全局扩展点配置实例
extensions_config = ExtensionsConfig()

# 自动加载所有扩展点
try:
    extensions_loader.load_extensions()
except Exception as e:
    print(f"Failed to load extensions: {e}")

__all__ = [
    "extensions_loader",
    "extensions_config",
    "ExtensionsLoader",
    "ExtensionsConfig"
]