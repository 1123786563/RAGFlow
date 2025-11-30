"""
扩展点配置管理模块

该模块负责管理RAGFlow扩展点的配置，包括扩展点的启用/禁用、
自定义扩展列表等配置项。
"""

import os
import json
from typing import Dict, Any, List


class ExtensionsConfig:
    """扩展点配置管理类"""
    
    def __init__(self, config_file: str = None):
        """
        初始化扩展点配置
        
        Args:
            config_file: 配置文件路径，默认为extensions目录下的config.json
        """
        self.config_file = config_file or os.path.join(os.path.dirname(__file__), "config.json")
        self.config = self._load_config()
    
    def _load_config(self) -> Dict[str, Any]:
        """加载配置"""
        # 默认配置
        default_config = {
            "document_parsers": {
                "enabled": True,
                "custom_parsers": [],
                "config": {}
            },
            "llm_providers": {
                "enabled": True,
                "custom_providers": [],
                "config": {}
            },
            "embedding_models": {
                "enabled": True,
                "custom_models": [],
                "config": {}
            },
            "agent_components": {
                "enabled": True,
                "custom_components": [],
                "config": {}
            },
            "api_endpoints": {
                "enabled": True,
                "custom_endpoints": [],
                "config": {}
            },
            "data_sources": {
                "enabled": True,
                "custom_sources": [],
                "config": {}
            },
            "storage_adapters": {
                "enabled": True,
                "custom_adapters": [],
                "config": {}
            }
        }
        
        # 从环境变量加载配置
        env_config = self._load_from_env()
        
        # 从配置文件加载配置
        file_config = self._load_from_file()
        
        # 合并配置，优先级：文件 > 环境变量 > 默认值
        merged_config = self._merge_configs(default_config, env_config, file_config)
        
        return merged_config
    
    def _load_from_env(self) -> Dict[str, Any]:
        """从环境变量加载配置"""
        config = {}
        
        # 文档解析器配置
        if "DOC_PARSERS_ENABLED" in os.environ:
            if "document_parsers" not in config:
                config["document_parsers"] = {}
            config["document_parsers"]["enabled"] = os.getenv("DOC_PARSERS_ENABLED", "true").lower() == "true"
        
        if "CUSTOM_DOC_PARSERS" in os.environ:
            if "document_parsers" not in config:
                config["document_parsers"] = {}
            custom_parsers = os.getenv("CUSTOM_DOC_PARSERS", "").split(",")
            config["document_parsers"]["custom_parsers"] = [p.strip() for p in custom_parsers if p.strip()]
        
        # LLM提供商配置
        if "LLM_PROVIDERS_ENABLED" in os.environ:
            if "llm_providers" not in config:
                config["llm_providers"] = {}
            config["llm_providers"]["enabled"] = os.getenv("LLM_PROVIDERS_ENABLED", "true").lower() == "true"
        
        if "CUSTOM_LLM_PROVIDERS" in os.environ:
            if "llm_providers" not in config:
                config["llm_providers"] = {}
            custom_providers = os.getenv("CUSTOM_LLM_PROVIDERS", "").split(",")
            config["llm_providers"]["custom_providers"] = [p.strip() for p in custom_providers if p.strip()]
        
        # 嵌入模型配置
        if "EMBEDDING_MODELS_ENABLED" in os.environ:
            if "embedding_models" not in config:
                config["embedding_models"] = {}
            config["embedding_models"]["enabled"] = os.getenv("EMBEDDING_MODELS_ENABLED", "true").lower() == "true"
        
        if "CUSTOM_EMBEDDING_MODELS" in os.environ:
            if "embedding_models" not in config:
                config["embedding_models"] = {}
            custom_models = os.getenv("CUSTOM_EMBEDDING_MODELS", "").split(",")
            config["embedding_models"]["custom_models"] = [m.strip() for m in custom_models if m.strip()]
        
        # Agent组件配置
        if "AGENT_COMPONENTS_ENABLED" in os.environ:
            if "agent_components" not in config:
                config["agent_components"] = {}
            config["agent_components"]["enabled"] = os.getenv("AGENT_COMPONENTS_ENABLED", "true").lower() == "true"
        
        if "CUSTOM_AGENT_COMPONENTS" in os.environ:
            if "agent_components" not in config:
                config["agent_components"] = {}
            custom_components = os.getenv("CUSTOM_AGENT_COMPONENTS", "").split(",")
            config["agent_components"]["custom_components"] = [c.strip() for c in custom_components if c.strip()]
        
        # API端点配置
        if "API_ENDPOINTS_ENABLED" in os.environ:
            if "api_endpoints" not in config:
                config["api_endpoints"] = {}
            config["api_endpoints"]["enabled"] = os.getenv("API_ENDPOINTS_ENABLED", "true").lower() == "true"
        
        if "CUSTOM_API_ENDPOINTS" in os.environ:
            if "api_endpoints" not in config:
                config["api_endpoints"] = {}
            custom_endpoints = os.getenv("CUSTOM_API_ENDPOINTS", "").split(",")
            config["api_endpoints"]["custom_endpoints"] = [e.strip() for e in custom_endpoints if e.strip()]
        
        # 数据源配置
        if "DATA_SOURCES_ENABLED" in os.environ:
            if "data_sources" not in config:
                config["data_sources"] = {}
            config["data_sources"]["enabled"] = os.getenv("DATA_SOURCES_ENABLED", "true").lower() == "true"
        
        if "CUSTOM_DATA_SOURCES" in os.environ:
            if "data_sources" not in config:
                config["data_sources"] = {}
            custom_sources = os.getenv("CUSTOM_DATA_SOURCES", "").split(",")
            config["data_sources"]["custom_sources"] = [s.strip() for s in custom_sources if s.strip()]
        
        # 存储适配器配置
        if "STORAGE_ADAPTERS_ENABLED" in os.environ:
            if "storage_adapters" not in config:
                config["storage_adapters"] = {}
            config["storage_adapters"]["enabled"] = os.getenv("STORAGE_ADAPTERS_ENABLED", "true").lower() == "true"
        
        if "CUSTOM_STORAGE_ADAPTERS" in os.environ:
            if "storage_adapters" not in config:
                config["storage_adapters"] = {}
            custom_adapters = os.getenv("CUSTOM_STORAGE_ADAPTERS", "").split(",")
            config["storage_adapters"]["custom_adapters"] = [a.strip() for a in custom_adapters if a.strip()]
        
        return config
    
    def _load_from_file(self) -> Dict[str, Any]:
        """从配置文件加载配置"""
        if not os.path.exists(self.config_file):
            return {}
        
        try:
            with open(self.config_file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Failed to load extension config from {self.config_file}: {e}")
            return {}
    
    def _merge_configs(self, default_config: Dict[str, Any], env_config: Dict[str, Any], file_config: Dict[str, Any]) -> Dict[str, Any]:
        """合并配置"""
        merged = default_config.copy()
        
        # 合并环境变量配置
        for key, value in env_config.items():
            if key in merged:
                if isinstance(merged[key], dict) and isinstance(value, dict):
                    merged[key].update(value)
                else:
                    merged[key] = value
            else:
                merged[key] = value
        
        # 合并文件配置
        for key, value in file_config.items():
            if key in merged:
                if isinstance(merged[key], dict) and isinstance(value, dict):
                    merged[key].update(value)
                else:
                    merged[key] = value
            else:
                merged[key] = value
        
        return merged
    
    def is_enabled(self, extension_type: str) -> bool:
        """
        检查扩展点类型是否启用
        
        Args:
            extension_type: 扩展点类型，如"document_parsers"
            
        Returns:
            bool: 是否启用
        """
        return self.config.get(extension_type, {}).get("enabled", False)
    
    def get_custom_extensions(self, extension_type: str) -> List[str]:
        """
        获取自定义扩展列表
        
        Args:
            extension_type: 扩展点类型，如"document_parsers"
            
        Returns:
            List[str]: 自定义扩展名称列表
        """
        extension_config = self.config.get(extension_type, {})
        
        # 根据扩展点类型获取对应的自定义扩展列表
        if extension_type == "document_parsers":
            return extension_config.get("custom_parsers", [])
        elif extension_type == "llm_providers":
            return extension_config.get("custom_providers", [])
        elif extension_type == "embedding_models":
            return extension_config.get("custom_models", [])
        elif extension_type == "agent_components":
            return extension_config.get("custom_components", [])
        elif extension_type == "api_endpoints":
            return extension_config.get("custom_endpoints", [])
        elif extension_type == "data_sources":
            return extension_config.get("custom_sources", [])
        elif extension_type == "storage_adapters":
            return extension_config.get("custom_adapters", [])
        
        return []
    
    def get_extension_config(self, extension_type: str) -> Dict[str, Any]:
        """
        获取扩展点配置
        
        Args:
            extension_type: 扩展点类型，如"document_parsers"
            
        Returns:
            Dict[str, Any]: 扩展点配置
        """
        return self.config.get(extension_type, {}).get("config", {})
    
    def save_config(self):
        """保存配置到文件"""
        try:
            with open(self.config_file, "w", encoding="utf-8") as f:
                json.dump(self.config, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Failed to save extension config to {self.config_file}: {e}")
    
    def reload_config(self):
        """重新加载配置"""
        self.config = self._load_config()


# 全局配置实例
extensions_config = ExtensionsConfig()