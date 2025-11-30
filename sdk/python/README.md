# RAGFlow Python SDK 使用指南

本目录包含RAGFlow Python SDK的使用示例，帮助您快速上手RAGFlow的各种功能。

## 目录结构

```
sdk/python/
├── ragflow_sdk/           # SDK核心代码
│   ├── __init__.py       # SDK入口和导出
│   ├── ragflow.py        # RAGFlow主类
│   └── modules/          # 功能模块
│       ├── agent.py      # 代理功能
│       ├── base.py       # 基础类
│       ├── chat.py       # 聊天功能
│       ├── chunk.py      # 文档块功能
│       ├── dataset.py    # 数据集功能
│       ├── document.py   # 文档功能
│       └── session.py    # 会话功能
├── examples/             # 使用示例
│   ├── example_basic_usage.py       # 基本使用示例
│   ├── example_document_parsing.py  # 文档解析示例
│   ├── example_chat_and_retrieval.py # 聊天和检索示例
│   └── example_advanced_usage.py    # 高级使用示例
├── test/                 # 测试代码
├── pyproject.toml        # 项目配置
└── README.md            # 本文件
```

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置环境变量

```bash
export RAGFLOW_API_KEY="your_api_key_here"
export RAGFLOW_BASE_URL="http://localhost:9380"
```

### 3. 运行示例

```bash
# 基本使用示例
python examples/example_basic_usage.py

# 文档解析示例
python examples/example_document_parsing.py

# 聊天和检索示例
python examples/example_chat_and_retrieval.py

# 高级使用示例
python examples/example_advanced_usage.py
```

## 示例说明

### 1. 基本使用示例 (`example_basic_usage.py`)

展示RAGFlow SDK的基本功能：
- 连接RAGFlow服务
- 创建数据集
- 上传文档
- 解析文档
- 创建聊天助手
- 进行问答对话

### 2. 文档解析示例 (`example_document_parsing.py`)

展示文档解析的详细流程：
- 创建示例文档
- 配置不同的解析策略
- 上传和解析文档
- 处理解析结果

### 3. 聊天和检索示例 (`example_chat_and_retrieval.py`)

展示聊天和检索功能：
- 创建知识库
- 配置自定义LLM和提示
- 创建聊天助手
- 进行问答对话
- 直接检索文档内容
- 管理会话历史

### 4. 高级使用示例 (`example_advanced_usage.py`)

展示高级功能和最佳实践：
- 批量处理文档
- 自定义嵌入模型
- 异步操作
- 错误处理和重试机制
- 性能优化技巧

## API 参考

### RAGFlow 类

主要的SDK入口类，提供以下方法：

- `create_dataset(name, description, **kwargs)`: 创建数据集
- `delete_datasets(dataset_ids)`: 删除数据集
- `get_dataset(dataset_id)`: 获取数据集
- `list_datasets()`: 列出所有数据集
- `create_chat(name, dataset_ids, **kwargs)`: 创建聊天助手
- `delete_chats(chat_ids)`: 删除聊天助手
- `list_chats()`: 列出所有聊天助手
- `retrieve(dataset_ids, question, **kwargs)`: 检索文档内容

### DataSet 类

数据集管理类，提供以下方法：

- `update(**kwargs)`: 更新数据集
- `upload_documents(documents)`: 上传文档
- `list_documents()`: 列出文档
- `delete_documents(document_ids)`: 删除文档
- `parse_documents(document_ids)`: 解析文档

### Chat 类

聊天助手管理类，提供以下方法：

- `update(**kwargs)`: 更新聊天助手
- `create_session(name)`: 创建会话
- `list_sessions()`: 列出会话
- `delete_sessions(session_ids)`: 删除会话

### Session 类

会话管理类，提供以下方法：

- `ask(question, **kwargs)`: 提问
- `get_messages()`: 获取消息历史

## 配置选项

### 数据集配置

- `name`: 数据集名称
- `description`: 数据集描述
- `embedding_model`: 嵌入模型
- `chunk_method`: 分块方法
- `chunk_size`: 分块大小
- `chunk_overlap`: 分块重叠

### 聊天助手配置

- `name`: 聊天助手名称
- `dataset_ids`: 关联的数据集ID列表
- `llm`: LLM配置
- `prompt`: 提示配置

### LLM配置

- `model_name`: 模型名称
- `temperature`: 温度参数
- `top_p`: Top-p参数
- `presence_penalty`: 存在惩罚
- `frequency_penalty`: 频率惩罚
- `max_tokens`: 最大令牌数

### 提示配置

- `similarity_threshold`: 相似度阈值
- `keywords_similarity_weight`: 关键词相似度权重
- `top_n`: 返回的文档数量
- `top_k`: 检索的文档数量
- `variables`: 变量列表
- `rerank_model`: 重排序模型
- `empty_response`: 空响应
- `opener`: 开场白
- `show_quote`: 是否显示引用
- `prompt`: 提示模板

## 最佳实践

1. **错误处理**: 使用try-except块处理API调用中的异常
2. **重试机制**: 对于网络请求，实现重试机制
3. **批量操作**: 对于大量文档，使用批量操作提高效率
4. **异步处理**: 对于耗时操作，考虑使用异步处理
5. **资源管理**: 及时释放不再使用的资源

## 常见问题

### 1. 连接失败

检查API密钥和基础URL是否正确配置：

```python
API_KEY = os.getenv("RAGFLOW_API_KEY", "your_api_key")
BASE_URL = os.getenv("RAGFLOW_BASE_URL", "http://localhost:9380")
```

### 2. 文档上传失败

确保文档格式正确，文件大小不超过限制：

```python
documents = [{
    "display_name": "example.txt",
    "blob": open("example.txt", "rb").read()
}]
```

### 3. 解析超时

对于大文档，可能需要增加超时时间或分批处理：

```python
# 分批解析
for i in range(0, len(document_ids), batch_size):
    batch_ids = document_ids[i:i+batch_size]
    dataset.parse_documents(batch_ids)
```

### 4. 检索结果不准确

调整检索参数：

```python
search_results = ragflow.retrieve(
    dataset_ids=[dataset.id],
    question="your question",
    similarity_threshold=0.1,  # 降低阈值
    top_k=10  # 增加检索数量
)
```

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

本项目采用 Apache License 2.0 许可证。详见 [LICENSE](../../LICENSE) 文件。