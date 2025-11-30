"""
LLM提供商基类

该模块定义了LLM提供商的抽象基类，所有自定义LLM提供商都应继承此基类。
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Union, AsyncGenerator
import time


class BaseLLMProvider(ABC):
    """LLM提供商基类，定义了所有LLM提供商应实现的接口"""
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        初始化LLM提供商
        
        Args:
            config: 提供商配置参数
        """
        self.config = config or {}
        self.name = self.config.get("name", self.__class__.__name__)
        self.api_key = self.config.get("api_key")
        self.api_base = self.config.get("api_base")
        self.timeout = self.config.get("timeout", 30)
        self.max_retries = self.config.get("max_retries", 3)
        self.temperature = self.config.get("temperature", 0.7)
        self.max_tokens = self.config.get("max_tokens", 2048)
    
    @abstractmethod
    def chat_completion(self, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
        """
        执行聊天补全
        
        Args:
            messages: 消息列表，每个消息包含role和content
            **kwargs: 其他参数
            
        Returns:
            Dict[str, Any]: 包含响应内容和元数据的字典
        """
        pass
    
    @abstractmethod
    async def chat_completion_async(self, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
        """
        异步执行聊天补全
        
        Args:
            messages: 消息列表，每个消息包含role和content
            **kwargs: 其他参数
            
        Returns:
            Dict[str, Any]: 包含响应内容和元数据的字典
        """
        pass
    
    @abstractmethod
    def stream_chat_completion(self, messages: List[Dict[str, str]], **kwargs) -> Union[str, AsyncGenerator]:
        """
        流式聊天补全
        
        Args:
            messages: 消息列表，每个消息包含role和content
            **kwargs: 其他参数
            
        Returns:
            Union[str, AsyncGenerator]: 流式响应或生成器
        """
        pass
    
    @abstractmethod
    async def stream_chat_completion_async(self, messages: List[Dict[str, str]], **kwargs) -> AsyncGenerator:
        """
        异步流式聊天补全
        
        Args:
            messages: 消息列表，每个消息包含role和content
            **kwargs: 其他参数
            
        Returns:
            AsyncGenerator: 异步生成器
        """
        pass
    
    @abstractmethod
    def list_models(self) -> List[Dict[str, Any]]:
        """
        列出可用的模型
        
        Returns:
            List[Dict[str, Any]]: 模型列表，每个模型包含id、名称等信息
        """
        pass
    
    @abstractmethod
    def get_model_info(self, model_id: str) -> Dict[str, Any]:
        """
        获取特定模型的信息
        
        Args:
            model_id: 模型ID
            
        Returns:
            Dict[str, Any]: 模型信息
        """
        pass
    
    def supports(self, capability: str) -> bool:
        """
        检查提供商是否支持特定功能
        
        Args:
            capability: 功能名称，如"chat", "completion", "embedding"等
            
        Returns:
            bool: 是否支持该功能
        """
        return capability in self.get_supported_capabilities()
    
    def get_supported_capabilities(self) -> List[str]:
        """
        获取提供商支持的功能列表
        
        Returns:
            List[str]: 支持的功能列表
        """
        return ["chat", "completion", "streaming"]
    
    def get_provider_name(self) -> str:
        """
        获取提供商名称
        
        Returns:
            str: 提供商名称
        """
        return self.name
    
    def get_provider_version(self) -> str:
        """
        获取提供商版本
        
        Returns:
            str: 提供商版本
        """
        return "1.0.0"
    
    def validate_config(self) -> bool:
        """
        验证提供商配置
        
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
                "name": {
                    "type": "string",
                    "description": "提供商名称"
                },
                "api_key": {
                    "type": "string",
                    "description": "API密钥"
                },
                "api_base": {
                    "type": "string",
                    "description": "API基础URL"
                },
                "timeout": {
                    "type": "integer",
                    "description": "请求超时时间（秒）",
                    "default": 30
                },
                "max_retries": {
                    "type": "integer",
                    "description": "最大重试次数",
                    "default": 3
                },
                "temperature": {
                    "type": "number",
                    "description": "生成温度",
                    "default": 0.7
                },
                "max_tokens": {
                    "type": "integer",
                    "description": "最大生成令牌数",
                    "default": 2048
                }
            },
            "required": ["api_key"]
        }
    
    def prepare_messages(self, messages: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """
        准备消息格式，确保符合提供商要求
        
        Args:
            messages: 原始消息列表
            
        Returns:
            List[Dict[str, str]]: 处理后的消息列表
        """
        return messages
    
    def handle_error(self, error: Exception, retry_count: int = 0) -> Dict[str, Any]:
        """
        处理API错误
        
        Args:
            error: 异常对象
            retry_count: 重试次数
            
        Returns:
            Dict[str, Any]: 错误信息
        """
        return {
            "error": str(error),
            "error_type": type(error).__name__,
            "retry_count": retry_count,
            "timestamp": time.time()
        }
    
    def log_request(self, messages: List[Dict[str, str]], **kwargs) -> None:
        """
        记录请求日志
        
        Args:
            messages: 消息列表
            **kwargs: 其他参数
        """
        # 实现日志记录逻辑
        pass
    
    def log_response(self, response: Dict[str, Any], **kwargs) -> None:
        """
        记录响应日志
        
        Args:
            response: 响应数据
            **kwargs: 其他参数
        """
        # 实现日志记录逻辑
        pass
    
    def estimate_tokens(self, text: str) -> int:
        """
        估算文本的令牌数
        
        Args:
            text: 文本内容
            
        Returns:
            int: 估算的令牌数
        """
        # 简单估算：每4个字符约等于1个令牌
        return len(text) // 4
    
    def truncate_text(self, text: str, max_tokens: int) -> str:
        """
        截断文本以适应最大令牌数
        
        Args:
            text: 原始文本
            max_tokens: 最大令牌数
            
        Returns:
            str: 截断后的文本
        """
        # 简单实现：按字符数截断
        max_chars = max_tokens * 4
        if len(text) <= max_chars:
            return text
        return text[:max_chars]
    
    def preprocess(self, messages: List[Dict[str, str]], **kwargs) -> List[Dict[str, str]]:
        """
        预处理消息
        
        Args:
            messages: 原始消息列表
            **kwargs: 其他参数
            
        Returns:
            List[Dict[str, str]]: 处理后的消息列表
        """
        return self.prepare_messages(messages)
    
    def postprocess(self, response: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        """
        后处理响应
        
        Args:
            response: 原始响应
            **kwargs: 其他参数
            
        Returns:
            Dict[str, Any]: 处理后的响应
        """
        return response