"""
LLM提供商注册模块

该模块提供了LLM提供商的注册和管理功能。
"""

from typing import Dict, Any, List, Type, Optional, Callable
from .base import BaseLLMProvider


class LLMProviderRegistry:
    """LLM提供商注册表，管理所有可用的LLM提供商"""
    
    def __init__(self):
        """初始化LLM提供商注册表"""
        self._providers: Dict[str, Type[BaseLLMProvider]] = {}
        self._instances: Dict[str, BaseLLMProvider] = {}
        self._aliases: Dict[str, str] = {}
    
    def register(self, name: str, provider_class: Type[BaseLLMProvider], aliases: List[str] = None) -> None:
        """
        注册LLM提供商
        
        Args:
            name: 提供商名称
            provider_class: 提供商类
            aliases: 提供商别名列表
        """
        if not issubclass(provider_class, BaseLLMProvider):
            raise ValueError(f"Provider class must inherit from BaseLLMProvider")
        
        self._providers[name] = provider_class
        
        # 注册别名
        if aliases:
            for alias in aliases:
                self._aliases[alias] = name
    
    def unregister(self, name: str) -> None:
        """
        注销LLM提供商
        
        Args:
            name: 提供商名称
        """
        if name in self._providers:
            del self._providers[name]
        
        # 移除相关别名
        aliases_to_remove = [alias for alias, provider in self._aliases.items() if provider == name]
        for alias in aliases_to_remove:
            del self._aliases[alias]
        
        # 移除实例
        if name in self._instances:
            del self._instances[name]
    
    def get_provider_class(self, name: str) -> Optional[Type[BaseLLMProvider]]:
        """
        获取提供商类
        
        Args:
            name: 提供商名称或别名
            
        Returns:
            Optional[Type[BaseLLMProvider]]: 提供商类
        """
        # 检查是否为别名
        provider_name = self._aliases.get(name, name)
        return self._providers.get(provider_name)
    
    def get_provider_instance(self, name: str, config: Dict[str, Any] = None) -> Optional[BaseLLMProvider]:
        """
        获取提供商实例
        
        Args:
            name: 提供商名称或别名
            config: 提供商配置
            
        Returns:
            Optional[BaseLLMProvider]: 提供商实例
        """
        # 检查是否为别名
        provider_name = self._aliases.get(name, name)
        
        # 如果已有实例且配置相同，返回现有实例
        if provider_name in self._instances:
            instance = self._instances[provider_name]
            if config is None or config == instance.config:
                return instance
        
        # 获取提供商类
        provider_class = self.get_provider_class(provider_name)
        if not provider_class:
            return None
        
        # 创建新实例
        instance = provider_class(config)
        self._instances[provider_name] = instance
        return instance
    
    def list_providers(self) -> List[str]:
        """
        列出所有已注册的提供商
        
        Returns:
            List[str]: 提供商名称列表
        """
        return list(self._providers.keys())
    
    def list_aliases(self) -> Dict[str, str]:
        """
        列出所有别名
        
        Returns:
            Dict[str, str]: 别名到提供商名称的映射
        """
        return self._aliases.copy()
    
    def is_registered(self, name: str) -> bool:
        """
        检查提供商是否已注册
        
        Args:
            name: 提供商名称或别名
            
        Returns:
            bool: 是否已注册
        """
        provider_name = self._aliases.get(name, name)
        return provider_name in self._providers
    
    def clear(self) -> None:
        """清空所有注册的提供商"""
        self._providers.clear()
        self._instances.clear()
        self._aliases.clear()


# 全局注册表实例
registry = LLMProviderRegistry()


def register_llm_provider(name: str, aliases: List[str] = None) -> Callable:
    """
    装饰器函数，用于注册LLM提供商
    
    Args:
        name: 提供商名称
        aliases: 提供商别名列表
        
    Returns:
        Callable: 装饰器函数
    """
    def decorator(provider_class: Type[BaseLLMProvider]) -> Type[BaseLLMProvider]:
        registry.register(name, provider_class, aliases)
        return provider_class
    
    return decorator


def get_llm_provider(name: str, config: Dict[str, Any] = None) -> Optional[BaseLLMProvider]:
    """
    获取LLM提供商实例
    
    Args:
        name: 提供商名称或别名
        config: 提供商配置
        
    Returns:
        Optional[BaseLLMProvider]: 提供商实例
    """
    return registry.get_provider_instance(name, config)


def list_llm_providers() -> List[str]:
    """
    列出所有可用的LLM提供商
    
    Returns:
        List[str]: 提供商名称列表
    """
    return registry.list_providers()