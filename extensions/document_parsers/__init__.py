"""
文档解析器扩展点模块

该模块提供文档解析器的扩展点功能，允许开发者添加自定义文档解析器，
支持不同类型的文档格式解析。
"""

from .base import BaseDocumentParser
from .registry import DocumentParserRegistry, register_parser

__all__ = [
    "BaseDocumentParser",
    "DocumentParserRegistry",
    "register_parser"
]