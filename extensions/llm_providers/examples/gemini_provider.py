"""
自定义Gemini LLM提供商示例

该模块演示如何实现自定义Gemini LLM提供商，继承BaseLLMProvider基类。
"""

import json
import time
from typing import Dict, Any, List, Optional, AsyncGenerator
import aiohttp
from ..base import BaseLLMProvider
from ..registry import register_llm_provider


@register_llm_provider("gemini", ["google"])
class GeminiLLMProvider(BaseLLMProvider):
    """自定义Gemini LLM提供商示例"""
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        初始化Gemini LLM提供商
        
        Args:
            config: 提供商配置参数
        """
        super().__init__(config)
        self.api_base = self.api_base or "https://generativelanguage.googleapis.com/v1beta"
        self.model = self.config.get("model", "gemini-pro")
        self.default_max_tokens = self.config.get("default_max_tokens", 2048)
    
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
        url = f"{self.api_base}/models/{self.model}:generateContent?key={self.api_key}"
        
        try:
            response = self._send_request(url, request_data)
            
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
        url = f"{self.api_base}/models/{self.model}:generateContent?key={self.api_key}"
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=request_data) as response:
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
        url = f"{self.api_base}/models/{self.model}:streamGenerateContent?key={self.api_key}"
        
        def generator():
            try:
                response = self._send_request(url, request_data, stream=True)
                
                for line in response.iter_lines():
                    if line:
                        line_str = line.decode('utf-8')
                        if line_str.startswith("data: "):
                            data_str = line_str[6:]
                            if data_str != "[DONE]":
                                try:
                                    data = json.loads(data_str)
                                    if "candidates" in data and data["candidates"]:
                                        candidate = data["candidates"][0]
                                        if "content" in candidate and "parts" in candidate["content"]:
                                            for part in candidate["content"]["parts"]:
                                                if "text" in part:
                                                    yield part["text"]
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
        url = f"{self.api_base}/models/{self.model}:streamGenerateContent?key={self.api_key}"
        
        async def generator():
            try:
                async with aiohttp.ClientSession() as session:
                    async with session.post(url, json=request_data) as response:
                        async for line in response.content:
                            line_str = line.decode('utf-8')
                            if line_str.startswith("data: "):
                                data_str = line_str[6:]
                                if data_str != "[DONE]":
                                    try:
                                        data = json.loads(data_str)
                                        if "candidates" in data and data["candidates"]:
                                            candidate = data["candidates"][0]
                                            if "content" in candidate and "parts" in candidate["content"]:
                                                for part in candidate["content"]["parts"]:
                                                    if "text" in part:
                                                        yield part["text"]
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
                "id": "gemini-pro",
                "name": "Gemini Pro",
                "description": "Google的通用语言模型",
                "max_tokens": 2048,
                "context_window": 32768
            },
            {
                "id": "gemini-pro-vision",
                "name": "Gemini Pro Vision",
                "description": "支持图像理解的Gemini模型",
                "max_tokens": 2048,
                "context_window": 16384
            },
            {
                "id": "gemini-1.5-pro",
                "name": "Gemini 1.5 Pro",
                "description": "Google的最新高性能模型",
                "max_tokens": 8192,
                "context_window": 1048576
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
        return ["chat", "completion", "streaming", "vision", "function_calling"]
    
    def get_provider_name(self) -> str:
        """
        获取提供商名称
        
        Returns:
            str: 提供商名称
        """
        return "Gemini (Google)"
    
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
            "description": "Gemini模型ID",
            "default": "gemini-pro",
            "enum": [
                "gemini-pro",
                "gemini-pro-vision",
                "gemini-1.5-pro"
            ]
        }
        schema["properties"]["default_max_tokens"] = {
            "type": "integer",
            "description": "默认最大令牌数",
            "default": 2048
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
        contents = []
        system_instruction = None
        
        for message in messages:
            if message.get("role") == "system":
                system_instruction = message.get("content")
            else:
                role = "user" if message.get("role") == "user" else "model"
                contents.append({
                    "role": role,
                    "parts": [{"text": message.get("content")}]
                })
        
        # 构建请求数据
        request_data = {
            "contents": contents,
            "generationConfig": {
                "temperature": kwargs.get("temperature", self.temperature),
                "maxOutputTokens": kwargs.get("max_tokens", self.max_tokens or self.default_max_tokens)
            }
        }
        
        if system_instruction:
            request_data["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }
        
        return request_data
    
    def _send_request(self, url: str, data: Dict[str, Any], stream: bool = False):
        """
        发送HTTP请求
        
        Args:
            url: 请求URL
            data: 请求数据
            stream: 是否流式请求
            
        Returns:
            Response: HTTP响应
        """
        import requests
        
        if stream:
            return requests.post(
                url,
                json=data,
                stream=True,
                timeout=self.timeout
            )
        else:
            response = requests.post(
                url,
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
        content = ""
        if "candidates" in response_data and response_data["candidates"]:
            candidate = response_data["candidates"][0]
            if "content" in candidate and "parts" in candidate["content"]:
                for part in candidate["content"]["parts"]:
                    if "text" in part:
                        content += part["text"]
        
        usage = {}
        if "usageMetadata" in response_data:
            usage = {
                "prompt_tokens": response_data["usageMetadata"].get("promptTokenCount", 0),
                "completion_tokens": response_data["usageMetadata"].get("candidatesTokenCount", 0),
                "total_tokens": response_data["usageMetadata"].get("totalTokenCount", 0)
            }
        
        return {
            "content": content,
            "model": self.model,
            "usage": usage,
            "finish_reason": response_data.get("candidates", [{}])[0].get("finishReason"),
            "timestamp": time.time()
        }