#!/usr/bin/env python3
"""
RAGFlow SDK 基本使用示例

本示例展示如何使用RAGFlow Python SDK进行基本操作：
1. 连接到RAGFlow服务
2. 创建数据集
3. 上传文档
4. 解析文档
5. 创建聊天会话
6. 进行问答
"""

import os
import sys
from pathlib import Path

# 添加SDK路径到Python路径
sdk_path = Path(__file__).parent / "ragflow_sdk"
sys.path.insert(0, str(sdk_path))

from ragflow_sdk import RAGFlow


def main():
    # 配置RAGFlow连接参数
    # 注意：请根据您的实际环境修改这些参数
    API_KEY = os.getenv("RAGFLOW_API_KEY", "ragflow-xxxxxxxxxxxxxx")
    BASE_URL = os.getenv("RAGFLOW_BASE_URL", "http://localhost:9380")
    
    # 初始化RAGFlow客户端
    try:
        ragflow = RAGFlow(API_KEY, BASE_URL)
        print(f"成功连接到RAGFlow服务: {BASE_URL}")
    except Exception as e:
        print(f"连接RAGFlow服务失败: {e}")
        return
    
    # 1. 创建数据集
    try:
        dataset = ragflow.create_dataset(
            name="示例数据集",
            description="这是一个使用SDK创建的示例数据集",
            embedding_model="BAAI/bge-large-zh-v1.5",
            chunk_method="naive"
        )
        print(f"成功创建数据集: {dataset.name} (ID: {dataset.id})")
    except Exception as e:
        print(f"创建数据集失败: {e}")
        return
    
    # 2. 上传文档
    try:
        # 这里使用一个示例文本文件
        # 在实际使用中，您可以使用真实的文档文件
        sample_text = """
        # RAGFlow简介
        
        RAGFlow是一个基于深度文档理解的开源RAG（检索增强生成）引擎。
        
        ## 主要特点
        
        1. **深度文档理解**：能够理解复杂文档的内在结构
        2. **高质量检索**：提供准确的文档片段检索
        3. **可扩展性**：支持多种文档格式和自定义扩展
        
        ## 使用场景
        
        - 知识库问答
        - 文档分析
        - 智能客服
        
        如需了解更多信息，请访问RAGFlow官方文档。
        """
        
        # 创建临时文件
        temp_file = "/tmp/ragflow_example.txt"
        with open(temp_file, "w", encoding="utf-8") as f:
            f.write(sample_text)
        
        # 上传文档
        with open(temp_file, "rb") as f:
            documents = dataset.upload_documents([{
                "display_name": "RAGFlow简介.txt",
                "blob": f.read()
            }])
        
        print(f"成功上传文档: {documents[0].name} (ID: {documents[0].id})")
        
        # 清理临时文件
        os.remove(temp_file)
    except Exception as e:
        print(f"上传文档失败: {e}")
        return
    
    # 3. 解析文档
    try:
        document_ids = [doc.id for doc in documents]
        results = dataset.parse_documents(document_ids)
        
        for doc_id, status, chunk_count, token_count in results:
            print(f"文档解析完成 - ID: {doc_id}, 状态: {status}, 块数: {chunk_count}, 令牌数: {token_count}")
    except Exception as e:
        print(f"解析文档失败: {e}")
        return
    
    # 4. 创建聊天会话
    try:
        chat = ragflow.create_chat(
            name="RAGFlow示例聊天",
            dataset_ids=[dataset.id],
            llm=None,  # 使用默认LLM设置
            prompt=None  # 使用默认提示设置
        )
        print(f"成功创建聊天会话: {chat.name} (ID: {chat.id})")
    except Exception as e:
        print(f"创建聊天会话失败: {e}")
        return
    
    # 5. 进行问答
    try:
        # 创建会话
        session = chat.create_session(name="示例会话")
        print(f"成功创建会话: {session.name} (ID: {session.id})")
        
        # 提问
        question = "RAGFlow的主要特点是什么？"
        response = session.ask(question)
        
        print(f"\n问题: {question}")
        print(f"回答: {response}")
    except Exception as e:
        print(f"问答失败: {e}")
        return
    
    print("\n示例执行完成！")


if __name__ == "__main__":
    main()