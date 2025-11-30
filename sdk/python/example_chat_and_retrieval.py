#!/usr/bin/env python3
"""
RAGFlow SDK 聊天和检索示例

本示例展示如何使用RAGFlow Python SDK进行聊天和检索：
1. 创建聊天助手
2. 自定义LLM和提示配置
3. 进行问答对话
4. 直接检索文档内容
5. 管理会话历史
"""

import os
import sys
from pathlib import Path

# 添加SDK路径到Python路径
sdk_path = Path(__file__).parent / "ragflow_sdk"
sys.path.insert(0, str(sdk_path))

from ragflow_sdk import RAGFlow
from ragflow_sdk.modules.chat import Chat


def create_knowledge_base(ragflow):
    """创建知识库"""
    # 创建知识库文档
    knowledge_text = """
    # RAGFlow使用指南
    
    ## 安装与部署
    
    ### Docker部署
    RAGFlow支持通过Docker进行快速部署：
    
    1. 拉取RAGFlow镜像
    ```bash
    docker pull infiniflow/ragflow:dev
    ```
    
    2. 启动RAGFlow容器
    ```bash
    docker run -d --name ragflow -p 9380:9380 infiniflow/ragflow:dev
    ```
    
    ### 源码部署
    如果需要从源码部署，请按照以下步骤：
    
    1. 克隆代码仓库
    ```bash
    git clone https://github.com/infiniflow/ragflow.git
    cd ragflow
    ```
    
    2. 安装依赖
    ```bash
    pip install -r requirements.txt
    ```
    
    3. 启动服务
    ```bash
    python api/entry.py
    ```
    
    ## 基本使用
    
    ### 创建数据集
    1. 登录RAGFlow Web界面
    2. 点击"知识库"->"创建知识库"
    3. 填写知识库名称和描述
    4. 选择嵌入模型和分块方法
    
    ### 上传文档
    1. 进入知识库详情页面
    2. 点击"上传文档"
    3. 选择要上传的文档
    4. 等待文档解析完成
    
    ### 创建聊天助手
    1. 点击"聊天"->"创建助手"
    2. 填写助手名称和描述
    3. 关联知识库
    4. 配置LLM和提示
    5. 开始对话
    
    ## 高级功能
    
    ### 自定义LLM
    RAGFlow支持多种LLM提供商：
    - OpenAI
    - Azure OpenAI
    - 本地模型（通过API）
    
    ### 自定义提示模板
    可以根据应用场景自定义提示模板，例如：
    - 客服场景
    - 技术问答
    - 教育辅导
    
    ### API集成
    RAGFlow提供RESTful API，可以轻松集成到现有应用中。
    
    ## 常见问题
    
    Q: 如何提高检索准确性？
    A: 可以通过以下方式提高检索准确性：
    1. 优化文档分块策略
    2. 调整相似度阈值
    3. 使用重排序模型
    4. 优化查询关键词
    
    Q: 如何处理多语言文档？
    A: RAGFlow支持多语言文档处理：
    1. 使用多语言嵌入模型
    2. 配置语言检测
    3. 设置跨语言检索
    
    Q: 如何优化系统性能？
    A: 可以通过以下方式优化性能：
    1. 增加GPU资源
    2. 优化索引策略
    3. 使用缓存机制
    4. 调整批处理大小
    """
    
    # 创建数据集
    dataset = ragflow.create_dataset(
        name="RAGFlow使用指南",
        description="RAGFlow使用指南和常见问题",
        embedding_model="BAAI/bge-large-zh-v1.5",
        chunk_method="manual"
    )
    
    # 上传文档
    temp_file = "/tmp/ragflow_guide.txt"
    with open(temp_file, "w", encoding="utf-8") as f:
        f.write(knowledge_text)
    
    with open(temp_file, "rb") as f:
        documents = dataset.upload_documents([{
            "display_name": "RAGFlow使用指南.txt",
            "blob": f.read()
        }])
    
    # 解析文档
    document_ids = [doc.id for doc in documents]
    dataset.parse_documents(document_ids)
    
    # 清理临时文件
    os.remove(temp_file)
    
    return dataset


def create_custom_llm(ragflow):
    """创建自定义LLM配置"""
    return Chat.LLM(
        ragflow,
        {
            "model_name": "qwen-plus",  # 使用通义千问模型
            "temperature": 0.1,
            "top_p": 0.3,
            "presence_penalty": 0.4,
            "frequency_penalty": 0.7,
            "max_tokens": 1024,
        }
    )


def create_custom_prompt(ragflow):
    """创建自定义提示配置"""
    return Chat.Prompt(
        ragflow,
        {
            "similarity_threshold": 0.2,
            "keywords_similarity_weight": 0.7,
            "top_n": 8,
            "top_k": 1024,
            "variables": [
                {"key": "knowledge", "optional": True},
                {"key": "question", "optional": False}
            ],
            "rerank_model": "",
            "empty_response": "抱歉，我在知识库中找不到相关信息，请尝试其他问题。",
            "opener": "您好！我是RAGFlow助手，有什么可以帮助您的吗？",
            "show_quote": True,
            "prompt": (
                "你是一个专业的RAGFlow助手，请根据提供的知识库内容回答用户问题。\n"
                "回答要求：\n"
                "1. 基于知识库内容进行回答\n"
                "2. 如果知识库中没有相关信息，请明确说明\n"
                "3. 回答要简洁明了，重点突出\n"
                "4. 可以适当引用知识库中的原文\n\n"
                "知识库内容：\n{knowledge}\n\n"
                "用户问题：{question}\n\n"
                "请回答："
            )
        }
    )


def main():
    # 配置RAGFlow连接参数
    API_KEY = os.getenv("RAGFLOW_API_KEY", "ragflow-xxxxxxxxxxxxxx")
    BASE_URL = os.getenv("RAGFLOW_BASE_URL", "http://localhost:9380")
    
    # 初始化RAGFlow客户端
    try:
        ragflow = RAGFlow(API_KEY, BASE_URL)
        print(f"成功连接到RAGFlow服务: {BASE_URL}")
    except Exception as e:
        print(f"连接RAGFlow服务失败: {e}")
        return
    
    # 创建知识库
    print("\n=== 创建知识库 ===")
    try:
        dataset = create_knowledge_base(ragflow)
        print(f"成功创建知识库: {dataset.name} (ID: {dataset.id})")
    except Exception as e:
        print(f"创建知识库失败: {e}")
        return
    
    # 创建聊天助手
    print("\n=== 创建聊天助手 ===")
    try:
        # 创建自定义LLM和提示
        custom_llm = create_custom_llm(ragflow)
        custom_prompt = create_custom_prompt(ragflow)
        
        # 创建聊天助手
        chat = ragflow.create_chat(
            name="RAGFlow专业助手",
            dataset_ids=[dataset.id],
            llm=custom_llm,
            prompt=custom_prompt
        )
        print(f"成功创建聊天助手: {chat.name} (ID: {chat.id})")
    except Exception as e:
        print(f"创建聊天助手失败: {e}")
        return
    
    # 创建会话并进行对话
    print("\n=== 创建会话并进行对话 ===")
    try:
        # 创建会话
        session = chat.create_session(name="RAGFlow使用咨询")
        print(f"成功创建会话: {session.name} (ID: {session.id})")
        
        # 示例问题列表
        questions = [
            "如何使用Docker部署RAGFlow？",
            "RAGFlow支持哪些LLM提供商？",
            "如何提高RAGFlow的检索准确性？",
            "RAGFlow是否支持多语言文档处理？"
        ]
        
        # 进行问答
        for question in questions:
            print(f"\n问题: {question}")
            response = session.ask(question)
            print(f"回答: {response}")
    except Exception as e:
        print(f"对话失败: {e}")
        return
    
    # 直接检索文档内容
    print("\n=== 直接检索文档内容 ===")
    try:
        # 检索相关文档
        search_results = ragflow.retrieve(
            dataset_ids=[dataset.id],
            question="如何优化RAGFlow性能？",
            similarity_threshold=0.1,
            top_k=5
        )
        
        print(f"检索到 {len(search_results)} 个相关文档片段:")
        for i, result in enumerate(search_results):
            print(f"\n片段 {i+1}:")
            print(f"内容: {result['content_with_weight'][:200]}...")
            print(f"相似度: {result['similarity_score']}")
            print(f"文档ID: {result['doc_id']}")
    except Exception as e:
        print(f"检索失败: {e}")
        return
    
    # 会话管理
    print("\n=== 会话管理 ===")
    try:
        # 列出所有会话
        sessions = chat.list_sessions()
        print(f"当前聊天助手有 {len(sessions)} 个会话:")
        for sess in sessions:
            print(f"  - {sess.name} (ID: {sess.id})")
        
        # 获取会话历史
        if sessions:
            first_session = sessions[0]
            messages = first_session.get_messages()
            print(f"\n会话 '{first_session.name}' 的历史消息:")
            for msg in messages:
                print(f"  {msg.role}: {msg.content[:100]}...")
    except Exception as e:
        print(f"会话管理失败: {e}")
        return
    
    print("\n聊天和检索示例执行完成！")


if __name__ == "__main__":
    main()