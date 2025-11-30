"""
自定义Markdown解析器示例

该模块演示如何实现自定义Markdown文档解析器，继承BaseDocumentParser基类。
"""

import os
import re
from typing import Dict, Any, List
from ..base import BaseDocumentParser
from ..registry import register_parser


@register_parser("custom_markdown")
class CustomMarkdownParser(BaseDocumentParser):
    """自定义Markdown解析器示例"""
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        初始化自定义Markdown解析器
        
        Args:
            config: 解析器配置参数
        """
        super().__init__(config)
        self.extract_code_blocks = self.config.get("extract_code_blocks", True)
        self.extract_tables = self.config.get("extract_tables", True)
        self.extract_images = self.config.get("extract_images", True)
        self.preserve_metadata = self.config.get("preserve_metadata", True)
    
    def parse(self, file_path: str, **kwargs) -> Dict[str, Any]:
        """
        解析Markdown文档
        
        Args:
            file_path: Markdown文件路径
            **kwargs: 其他解析参数
            
        Returns:
            Dict[str, Any]: 解析结果，包含内容和元数据
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Markdown file not found: {file_path}")
        
        # 提取元数据
        metadata = self.extract_metadata(file_path, **kwargs)
        
        # 解析Markdown内容
        content = self._extract_content(file_path, **kwargs)
        
        # 提取结构化元素
        structure = self._extract_structure(content, **kwargs)
        
        # 构建解析结果
        result = {
            "content": content,
            "metadata": metadata,
            "structure": structure,
            "chunks": self._chunk_content(content, **kwargs),
            "code_blocks": self._extract_code_blocks(content, **kwargs) if self.extract_code_blocks else [],
            "tables": self._extract_tables(content, **kwargs) if self.extract_tables else [],
            "images": self._extract_images(content, **kwargs) if self.extract_images else []
        }
        
        # 后处理结果
        return self.postprocess(result, **kwargs)
    
    def supports(self, file_extension: str) -> bool:
        """
        检查是否支持指定的文件类型
        
        Args:
            file_extension: 文件扩展名，如".md"等
            
        Returns:
            bool: 是否支持该文件类型
        """
        return file_extension.lower() in [".md", ".markdown"]
    
    def get_parser_name(self) -> str:
        """
        获取解析器名称
        
        Returns:
            str: 解析器名称
        """
        return "Custom Markdown Parser"
    
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
            "properties": {
                "extract_code_blocks": {
                    "type": "boolean",
                    "description": "是否提取代码块",
                    "default": True
                },
                "extract_tables": {
                    "type": "boolean",
                    "description": "是否提取表格",
                    "default": True
                },
                "extract_images": {
                    "type": "boolean",
                    "description": "是否提取图片",
                    "default": True
                },
                "preserve_metadata": {
                    "type": "boolean",
                    "description": "是否保留元数据",
                    "default": True
                },
                "chunk_size": {
                    "type": "integer",
                    "description": "文本分块大小",
                    "default": 1024
                },
                "chunk_overlap": {
                    "type": "integer",
                    "description": "文本分块重叠大小",
                    "default": 50
                }
            },
            "required": []
        }
    
    def _extract_content(self, file_path: str, **kwargs) -> str:
        """
        提取Markdown文本内容
        
        Args:
            file_path: Markdown文件路径
            **kwargs: 其他提取参数
            
        Returns:
            str: 提取的文本内容
        """
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    
    def _extract_structure(self, content: str, **kwargs) -> Dict[str, Any]:
        """
        提取Markdown文档结构
        
        Args:
            content: Markdown内容
            **kwargs: 其他提取参数
            
        Returns:
            Dict[str, Any]: 文档结构信息
        """
        # 提取标题层级
        headings = []
        for match in re.finditer(r'^(#{1,6})\s+(.+)$', content, re.MULTILINE):
            level = len(match.group(1))
            title = match.group(2).strip()
            position = match.start()
            headings.append({
                "level": level,
                "title": title,
                "position": position
            })
        
        # 提取链接
        links = []
        for match in re.finditer(r'\[([^\]]+)\]\(([^)]+)\)', content):
            text = match.group(1)
            url = match.group(2)
            position = match.start()
            links.append({
                "text": text,
                "url": url,
                "position": position
            })
        
        return {
            "headings": headings,
            "links": links
        }
    
    def _chunk_content(self, content: str, **kwargs) -> List[Dict[str, Any]]:
        """
        将内容分块，优先在标题边界处分割
        
        Args:
            content: 文本内容
            **kwargs: 其他分块参数
            
        Returns:
            List[Dict[str, Any]]: 文本块列表
        """
        chunk_size = kwargs.get("chunk_size", self.config.get("chunk_size", 1024))
        chunk_overlap = kwargs.get("chunk_overlap", self.config.get("chunk_overlap", 50))
        
        # 优先在标题处分割
        headings = list(re.finditer(r'^#{1,6}\s+', content, re.MULTILINE))
        
        if not headings:
            # 如果没有标题，按固定大小分割
            return self._simple_chunk(content, chunk_size, chunk_overlap)
        
        chunks = []
        current_start = 0
        
        for i, heading in enumerate(headings):
            if heading.start - current_start > chunk_size:
                # 当前块太大，需要分割
                chunk_text = content[current_start:heading.start]
                chunks.append({
                    "text": chunk_text,
                    "start": current_start,
                    "end": heading.start,
                    "size": len(chunk_text),
                    "type": "content"
                })
                current_start = heading.start
        
        # 添加最后一块
        if current_start < len(content):
            chunk_text = content[current_start:]
            chunks.append({
                "text": chunk_text,
                "start": current_start,
                "end": len(content),
                "size": len(chunk_text),
                "type": "content"
            })
        
        return chunks
    
    def _simple_chunk(self, content: str, chunk_size: int, chunk_overlap: int) -> List[Dict[str, Any]]:
        """
        简单的文本分块方法
        
        Args:
            content: 文本内容
            chunk_size: 块大小
            chunk_overlap: 重叠大小
            
        Returns:
            List[Dict[str, Any]]: 文本块列表
        """
        chunks = []
        start = 0
        
        while start < len(content):
            end = start + chunk_size
            if end > len(content):
                end = len(content)
            
            chunk_text = content[start:end]
            chunks.append({
                "text": chunk_text,
                "start": start,
                "end": end,
                "size": len(chunk_text),
                "type": "content"
            })
            
            if end >= len(content):
                break
            
            start = end - chunk_overlap
        
        return chunks
    
    def _extract_code_blocks(self, content: str, **kwargs) -> List[Dict[str, Any]]:
        """
        提取Markdown中的代码块
        
        Args:
            content: Markdown内容
            **kwargs: 其他提取参数
            
        Returns:
            List[Dict[str, Any]]: 代码块列表
        """
        code_blocks = []
        
        # 匹配围栏代码块
        for match in re.finditer(r'```(\w+)?\n(.*?)\n```', content, re.DOTALL):
            language = match.group(1) or "text"
            code = match.group(2)
            position = match.start()
            
            code_blocks.append({
                "language": language,
                "code": code,
                "position": position,
                "type": "fenced"
            })
        
        # 匹配缩进代码块
        for match in re.finditer(r'(?:^    .+$\n?)+', content, re.MULTILINE):
            code = match.group(0).replace('    ', '')
            position = match.start()
            
            code_blocks.append({
                "language": "text",
                "code": code,
                "position": position,
                "type": "indented"
            })
        
        return code_blocks
    
    def _extract_tables(self, content: str, **kwargs) -> List[Dict[str, Any]]:
        """
        提取Markdown中的表格
        
        Args:
            content: Markdown内容
            **kwargs: 其他提取参数
            
        Returns:
            List[Dict[str, Any]]: 表格列表
        """
        tables = []
        
        # 简单的表格匹配
        table_pattern = r'(\|.*\|[\r\n]+\|[-\s\|]+\|[\r\n]+(?:\|.*\|[\r\n]*)+)'
        
        for match in re.finditer(table_pattern, content):
            table_text = match.group(0)
            position = match.start()
            
            lines = table_text.strip().split('\n')
            if len(lines) < 3:
                continue
            
            # 解析表头
            headers = [cell.strip() for cell in lines[0].split('|')[1:-1]]
            
            # 解析数据行
            rows = []
            for line in lines[2:]:
                if line.strip():
                    cells = [cell.strip() for cell in line.split('|')[1:-1]]
                    rows.append(cells)
            
            tables.append({
                "headers": headers,
                "rows": rows,
                "position": position,
                "raw": table_text
            })
        
        return tables
    
    def _extract_images(self, content: str, **kwargs) -> List[Dict[str, Any]]:
        """
        提取Markdown中的图片
        
        Args:
            content: Markdown内容
            **kwargs: 其他提取参数
            
        Returns:
            List[Dict[str, Any]]: 图片列表
        """
        images = []
        
        # 匹配图片语法
        for match in re.finditer(r'!\[([^\]]*)\]\(([^)]+)\)', content):
            alt_text = match.group(1)
            url = match.group(2)
            position = match.start()
            
            images.append({
                "alt_text": alt_text,
                "url": url,
                "position": position
            })
        
        return images