"""
自定义Claude LLM提供商示例

该模块演示如何实现自定义Claude LLM提供商，继承BaseLLMProvider基类。
"""

import json
import time
from typing import Dict, Any, List, Optional, AsyncGenerator
import aiohttp
from ..base import BaseLLMProvider
from ..registry import register_llm_provider


@register_llm_provider("claude", ["anthropic"])
class ClaudeLLMProvider(BaseLLMProvider):
    """自定义Claude LLM提供商示例"""
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        初始化Claude LLM提供商
        
        Args:
            config: 提供商配置参数
        """
        super().__init__(config)
        self.api_base = self.api_base or "https://api.anthropic.com/v1"
        self.model = self.config.get("model", "claude-3-sonnet-20240229")
        self.default_max_tokens = self.config.get("default_max_tokens", 4096)
    
    def chat_completion(self, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
        """
        执行聊天补全
        
        Args:
            messages: 消息列表，每个消息包含role和content
            **kwargs: 其他参数
            
        Returns:
            Dict[str, Any]: 包含响应内容和元数据的字典
        """
        # 准备请求数据
        request_data = self._prepare_request_data(messages, **kwargs)
        
        # 记录请求
        self.log_request(messages, **kwargs)
        
        # 发送请求
        headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01"
        }
        
        try:
            response = self._send_request(
                f"{self.api_base}/messages",
                headers=headers,
                data=request_data
            )
            
            # 解析响应
            result = self._parse_response(response)
            
            # 记录响应
            self.log_response(result, **kwargs)
            
            return result
        except Exception as e:
            return self.handle_error(e)
    
    async def chat_completion_async(self, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
        """
        异步执行聊天补全
        
        Args:
            messages: 消息列表，每个消息包含role和content
            **kwargs: 其他参数
            
        Returns:
            Dict[str, Any]: 包含响应内容和元数据的字典
        """
        # 准备请求数据
        request_data = self._prepare_request_data(messages, **kwargs)
        
        # 记录请求
        self.log_request(messages, **kwargs)
        
        # 发送请求
        headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01"
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{self.api_base}/messages",
                    headers=headers,
                    json=request_data
                ) as response:
                    response_data = await response.json()
                    
                    # 解析响应
                    result = self._parse_response(response_data)
                    
                    # 记录响应
                    self.log_response(result, **kwargs)
                    
                    return result
        except Exception as e:
            return self.handle_error(e)
    
    def stream_chat_completion(self, messages: List[Dict[str, str]], **kwargs) -> Union[str, AsyncGenerator]:
        """
        流式聊天补全
        
        Args:
            messages: 消息列表，每个消息包含role和content
            **kwargs: 其他参数
            
        Returns:
            Union[str, AsyncGenerator]: 流式响应或生成器
        """
        # 准备请求数据
        request_data = self._prepare_request_data(messages, stream=True, **kwargs)
        
        # 记录请求
        self.log_request(messages, **kwargs)
        
        # 发送请求
        headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01"
        }
        
        def generator():
            try:
                response = self._send_request(
                    f"{self.api_base}/messages",
                    headers=headers,
                    data=request_data,
                    stream=True
                )
                
                for line in response.iter_lines():
                    if line:
                        line_str = line.decode('utf-8')
                        if line_str.startswith("data: "):
                            data_str = line_str[6:]
                            if data_str != "[DONE]":
                                try:
                                    data = json.loads(data_str)
                                    if data.get("type") == "content_block_delta":
                                        delta = data.get("delta", {})
                                        if "text" in delta:
                                            yield delta["text"]
                                except json.JSONDecodeError:
                                    continue
            except Exception as e:
                yield json.dumps(self.handle_error(e))
        
        return generator()
    
    async def stream_chat_completion_async(self, messages: List[Dict[str, str]], **kwargs) -> AsyncGenerator:
        """
        异步流式聊天补全
        
        Args:
            messages: 消息列表，每个消息包含role和content
            **kwargs: 其他参数
            
        Returns:
            AsyncGenerator: 异步生成器
        """
        # 准备请求数据
        request_data = self._prepare_request_data(messages, stream=True, **kwargs)
        
        # 记录请求
        self.log_request(messages, **kwargs)
        
        # 发送请求
        headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01"
        }
        
        async def generator():
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.post(
                        f"{self.api_base}/messages",
                        headers=headers,
                        json=request_data
                    ) as response:
                        async for line in response.content:
                            line_str = line.decode('utf-8')
                            if line_str.startswith("data: "):
                                data_str = line_str[6:]
                                if data_str != "[DONE]":
                                    try:
                                        data = json.loads(data_str)
                                        if data.get("type") == "content_block_delta":
                                            delta = data.get("delta", {})
                                            if "text" in delta:
                                                yield delta["text"]
                                    except json.JSONDecodeError:
                                        continue
            except Exception as e:
                yield json.dumps(self.handle_error(e))
        
        return generator()
    
    def list_models(self) -> List[Dict[str, Any]]:
        """
        列出可用的模型
        
        Returns:
            List[Dict[str, Any]]: 模型列表，每个模型包含id、名称等信息
        """
        return [
            {
                "id": "claude-3-opus-20240229",
                "name": "Claude 3 Opus",
                "description": "最强大的Claude模型，适用于复杂任务",
                "max_tokens": 4096,
                "context_window": 200000
            },
            {
                "id": "claude-3-sonnet-20240229",
                "name": "Claude 3 Sonnet",
                "description": "平衡性能和速度的Claude模型",
                "max_tokens": 4096,
                "context_window": 200000
            },
            {
                "id": "claude-3-haiku-20240307",
                "name": "Claude 3 Haiku",
                "description": "最快的Claude模型，适用于简单任务",
                "max_tokens": 4096,
                "context_window": 200000
            }
        ]
    
    def get_model_info(self, model_id: str) -> Dict[str, Any]:
        """
        获取特定模型的信息
        
        Args:
            model_id: 模型ID
            
        Returns:
            Dict[str, Any]: 模型信息
        """
        models = {model["id"]: model for model in self.list_models()}
        return models.get(model_id, {})
    
    def get_supported_capabilities(self) -> List[str]:
        """
        获取提供商支持的功能列表
        
        Returns:
            List[str]: 支持的功能列表
        """
        return ["chat", "completion", "streaming", "vision"]
    
    def get_provider_name(self) -> str:
        """
        获取提供商名称
        
        Returns:
            str: 提供商名称
        """
        return "Claude (Anthropic)"
    
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
        return self.api_key is not None
    
    def get_config_schema(self) -> Dict[str, Any]:
        """
        获取配置模式
        
        Returns:
            Dict[str, Any]: 配置模式定义
        """
        schema = super().get_config_schema()
        schema["properties"]["model"] = {
            "type": "string",
            "description": "Claude模型ID",
            "default": "claude-3-sonnet-20240229",
            "enum": [
                "claude-3-opus-20240229",
                "claude-3-sonnet-20240229",
                "claude-3-haiku-20240307"
            ]
        }
        schema["properties"]["default_max_tokens"] = {
            "type": "integer",
            "description": "默认最大令牌数",
            "default": 4096
        }
        return schema
    
    def _prepare_request_data(self, messages: List[Dict[str, str]], stream: bool = False, **kwargs) -> Dict[str, Any]:
        """
        准备请求数据
        
        Args:
            messages: 消息列表
            stream: 是否流式请求
            **kwargs: 其他参数
            
        Returns:
            Dict[str, Any]: 请求数据
        """
        # 转换消息格式
        claude_messages = []
        system_message = None
        
        for message in messages:
            if message.get("role") == "system":
                system_message = message.get("content")
            else:
                claude_messages.append({
                    "role": message.get("role"),
                    "content": message.get("content")
                })
        
        # 构建请求数据
        request_data = {
            "model": kwargs.get("model", self.model),
            "max_tokens": kwargs.get("max_tokens", self.max_tokens or self.default_max_tokens),
            "temperature": kwargs.get("temperature", self.temperature),
            "messages": claude_messages
        }
        
        if system_message:
            request_data["system"] = system_message
        
        if stream:
            request_data["stream"] = True
        
        return request_data
    
    def _send_request(self, url: str, headers: Dict[str, str], data: Dict[str, Any], stream: bool = False):
        """
        发送HTTP请求
        
        Args:
            url: 请求URL
            headers: 请求头
            data: 请求数据
            stream: 是否流式请求
            
        Returns:
            Response: HTTP响应
        """
        import requests
        
        if stream:
            return requests.post(
                url,
                headers=headers,
                json=data,
                stream=True,
                timeout=self.timeout
            )
        else:
            response = requests.post(
                url,
                headers=headers,
                json=data,
                timeout=self.timeout
            )
            response.raise_for_status()
            return response.json()
    
    def _parse_response(self, response_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        解析响应数据
        
        Args:
            response_data: 原始响应数据
            
        Returns:
            Dict[str, Any]: 解析后的响应
        """
        if "content" in response_data and response_data["content"]:
            content = response_data["content"][0].get("text", "")
        else:
            content = ""
        
        return {
            "content": content,
            "model": response_data.get("model"),
            "usage": response_data.get("usage", {}),
            "id": response_data.get("id"),
            "type": response_data.get("type"),
            "role": response_data.get("role"),
            "stop_reason": response_data.get("stop_reason"),
            "stop_sequence": response_data.get("stop_sequence"),
            "timestamp": time.time()
        }