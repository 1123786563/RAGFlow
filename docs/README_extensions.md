# RAGFlow 扩展点使用指南

本指南将帮助您了解如何使用RAGFlow的扩展点系统，以及如何创建自定义扩展。

## 目录

1. [扩展点概述](#扩展点概述)
2. [文档解析器扩展](#文档解析器扩展)
3. [LLM提供商扩展](#llm提供商扩展)
4. [嵌入模型扩展](#嵌入模型扩展)
5. [Agent组件扩展](#agent组件扩展)
6. [API端点扩展](#api端点扩展)
7. [数据源扩展](#数据源扩展)
8. [存储适配器扩展](#存储适配器扩展)
9. [扩展点配置](#扩展点配置)
10. [最佳实践](#最佳实践)

## 扩展点概述

RAGFlow扩展点系统允许您在不修改核心代码的情况下扩展系统功能。每个扩展点都有明确定义的接口和注册机制，确保扩展与主代码隔离，便于后续升级。

### 主要扩展点

1. **文档解析器扩展** - 添加对新文档格式的支持
2. **LLM提供商扩展** - 集成新的语言模型提供商
3. **嵌入模型扩展** - 添加新的嵌入模型
4. **Agent组件扩展** - 创建自定义Agent组件
5. **API端点扩展** - 添加自定义API端点
6. **数据源扩展** - 集成新的数据源
7. **存储适配器扩展** - 支持新的存储系统

## 文档解析器扩展

文档解析器扩展允许您添加对新文档格式的支持。

### 创建自定义文档解析器

1. 继承 `BaseDocumentParser` 基类
2. 实现必需的抽象方法：`parse()` 和 `supports()`
3. 使用 `@register_parser` 装饰器注册解析器

### 示例

```python
from extensions.document_parsers.base import BaseDocumentParser
from extensions.document_parsers.registry import register_parser

@register_parser("custom_format")
class CustomFormatParser(BaseDocumentParser):
    def parse(self, file_path: str, **kwargs):
        # 实现解析逻辑
        pass
    
    def supports(self, file_extension: str) -> bool:
        return file_extension.lower() == ".custom"
```

### 使用自定义解析器

```python
from extensions.document_parsers.registry import get_document_parser

# 获取解析器实例
parser = get_document_parser("custom_format", config={...})

# 解析文档
result = parser.parse("path/to/file.custom")
```

## LLM提供商扩展

LLM提供商扩展允许您集成新的语言模型提供商。

### 创建自定义LLM提供商

1. 继承 `BaseLLMProvider` 基类
2. 实现必需的抽象方法：`chat_completion()`, `chat_completion_async()`, `stream_chat_completion()` 等
3. 使用 `@register_llm_provider` 装饰器注册提供商

### 示例

```python
from extensions.llm_providers.base import BaseLLMProvider
from extensions.llm_providers.registry import register_llm_provider

@register_llm_provider("custom_llm")
class CustomLLMProvider(BaseLLMProvider):
    def chat_completion(self, messages, **kwargs):
        # 实现聊天补全逻辑
        pass
    
    def list_models(self):
        # 返回支持的模型列表
        pass
```

### 使用自定义LLM提供商

```python
from extensions.llm_providers.registry import get_llm_provider

# 获取提供商实例
provider = get_llm_provider("custom_llm", config={"api_key": "your_key"})

# 使用提供商
response = provider.chat_completion([{"role": "user", "content": "Hello"}])
```

## 嵌入模型扩展

嵌入模型扩展允许您添加新的嵌入模型。

### 创建自定义嵌入模型

1. 继承 `BaseEmbeddingModel` 基类
2. 实现必需的抽象方法：`embed()` 和 `embed_batch()`
3. 使用 `@register_embedding_model` 装饰器注册模型

### 示例

```python
from extensions.embedding_models.base import BaseEmbeddingModel
from extensions.embedding_models.registry import register_embedding_model

@register_embedding_model("custom_embedding")
class CustomEmbeddingModel(BaseEmbeddingModel):
    def embed(self, text: str) -> List[float]:
        # 实现单个文本嵌入逻辑
        pass
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        # 实现批量文本嵌入逻辑
        pass
```

## Agent组件扩展

Agent组件扩展允许您创建自定义的Agent组件。

### 创建自定义Agent组件

1. 继承 `BaseAgentComponent` 基类
2. 实现必需的抽象方法：`invoke()` 和 `get_component_info()`
3. 使用 `@register_agent_component` 装饰器注册组件

### 示例

```python
from extensions.agent_components.base import BaseAgentComponent
from extensions.agent_components.registry import register_agent_component

@register_agent_component("custom_component")
class CustomAgentComponent(BaseAgentComponent):
    def invoke(self, *args, **kwargs):
        # 实现组件逻辑
        pass
    
    def get_component_info(self):
        # 返回组件信息
        pass
```

## API端点扩展

API端点扩展允许您添加自定义的API端点。

### 创建自定义API端点

1. 继承 `BaseAPIEndpoint` 基类
2. 实现必需的抽象方法：`register_routes()` 和 `get_endpoint_info()`
3. 使用 `@register_api_endpoint` 装饰器注册端点

### 示例

```python
from extensions.api_endpoints.base import BaseAPIEndpoint
from extensions.api_endpoints.registry import register_api_endpoint

@register_api_endpoint("custom_endpoint")
class CustomAPIEndpoint(BaseAPIEndpoint):
    def register_routes(self, app):
        # 注册路由
        @app.route("/api/custom", methods=["POST"])
        def custom_handler():
            # 处理请求
            pass
    
    def get_endpoint_info(self):
        # 返回端点信息
        pass
```

## 数据源扩展

数据源扩展允许您集成新的数据源。

### 创建自定义数据源

1. 继承 `BaseDataSource` 基类
2. 实现必需的抽象方法：`connect()`, `fetch_data()` 和 `disconnect()`
3. 使用 `@register_data_source` 装饰器注册数据源

### 示例

```python
from extensions.data_sources.base import BaseDataSource
from extensions.data_sources.registry import register_data_source

@register_data_source("custom_source")
class CustomDataSource(BaseDataSource):
    def connect(self, config):
        # 实现连接逻辑
        pass
    
    def fetch_data(self, query):
        # 实现数据获取逻辑
        pass
    
    def disconnect(self):
        # 实现断开连接逻辑
        pass
```

## 存储适配器扩展

存储适配器扩展允许您支持新的存储系统。

### 创建自定义存储适配器

1. 继承 `BaseStorageAdapter` 基类
2. 实现必需的抽象方法：`save()`, `load()`, `delete()` 和 `exists()`
3. 使用 `@register_storage_adapter` 装饰器注册适配器

### 示例

```python
from extensions.storage_adapters.base import BaseStorageAdapter
from extensions.storage_adapters.registry import register_storage_adapter

@register_storage_adapter("custom_storage")
class CustomStorageAdapter(BaseStorageAdapter):
    def save(self, key, value):
        # 实现保存逻辑
        pass
    
    def load(self, key):
        # 实现加载逻辑
        pass
    
    def delete(self, key):
        # 实现删除逻辑
        pass
    
    def exists(self, key):
        # 实现存在性检查逻辑
        pass
```

## 扩展点配置

扩展点配置存储在 `extensions/config.json` 文件中，您可以在此文件中启用或禁用特定扩展点，以及配置扩展点的参数。

### 配置示例

```json
{
  "document_parsers": {
    "enabled": true,
    "custom_parsers": ["custom_pdf", "custom_docx"],
    "config": {
      "default_parser": "pdf_parser",
      "chunk_size": 1024,
      "chunk_overlap": 50
    }
  },
  "llm_providers": {
    "enabled": true,
    "custom_providers": ["claude", "gemini"],
    "config": {
      "default_provider": "openai",
      "timeout": 30,
      "max_retries": 3
    }
  }
}
```

## 最佳实践

1. **遵循接口约定** - 确保您的扩展实现了所有必需的方法和属性
2. **错误处理** - 在扩展中实现适当的错误处理和日志记录
3. **配置验证** - 验证扩展配置的有效性
4. **性能考虑** - 优化扩展的性能，特别是对于资源密集型操作
5. **测试** - 为您的扩展编写全面的测试
6. **文档** - 为您的扩展提供清晰的文档和使用示例
7. **版本控制** - 使用语义版本控制来管理扩展的版本
8. **依赖管理** - 明确声明扩展的依赖项
9. **安全性** - 确保扩展不会引入安全漏洞
10. **兼容性** - 考虑与不同版本的RAGFlow的兼容性

## 扩展点加载

RAGFlow在启动时会自动加载所有启用的扩展点。您也可以在运行时动态加载或重新加载扩展点。

```python
from extensions import load_extensions, reload_extensions

# 加载所有扩展点
load_extensions()

# 重新加载特定扩展点
reload_extensions("document_parsers")
```

## 扩展点故障排除

如果扩展点无法正常工作，请检查以下内容：

1. 扩展是否正确注册
2. 扩展配置是否有效
3. 扩展依赖是否已安装
4. 扩展代码是否有语法错误
5. 扩展是否与当前RAGFlow版本兼容

## 扩展点贡献

如果您创建了有用的扩展点，请考虑将其贡献给RAGFlow社区。请遵循以下步骤：

1. 确保您的扩展遵循RAGFlow的代码规范
2. 为您的扩展编写全面的测试
3. 为您的扩展提供清晰的文档
4. 提交Pull Request并描述您的扩展的功能和用法

## 扩展点支持

如果您在使用扩展点时遇到问题，请：

1. 查看扩展点文档
2. 检查示例实现
3. 在RAGFlow社区寻求帮助
4. 提交问题报告并提供详细的错误信息

---

有关更多详细信息，请参阅各个扩展点的具体文档。