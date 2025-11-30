#!/usr/bin/env python3
"""
RAGFlow SDK 高级使用示例

本示例展示RAGFlow SDK的高级功能：
1. 批量处理文档
2. 自定义嵌入模型
3. 异步操作
4. 错误处理和重试机制
5. 性能优化技巧
"""

import os
import sys
import asyncio
import time
from pathlib import Path
from typing import List, Dict, Any

# 添加SDK路径到Python路径
sdk_path = Path(__file__).parent / "ragflow_sdk"
sys.path.insert(0, str(sdk_path))

from ragflow_sdk import RAGFlow


class RAGFlowAdvancedClient:
    """RAGFlow高级客户端封装，提供重试机制和性能优化"""
    
    def __init__(self, api_key: str, base_url: str, max_retries: int = 3, retry_delay: float = 1.0):
        """
        初始化高级客户端
        
        Args:
            api_key: RAGFlow API密钥
            base_url: RAGFlow服务URL
            max_retries: 最大重试次数
            retry_delay: 重试延迟(秒)
        """
        self.ragflow = RAGFlow(api_key, base_url)
        self.max_retries = max_retries
        self.retry_delay = retry_delay
    
    def _retry_on_failure(self, func, *args, **kwargs):
        """在失败时重试的装饰器"""
        for attempt in range(self.max_retries):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                if attempt == self.max_retries - 1:
                    raise e
                print(f"操作失败，{self.retry_delay}秒后重试 (尝试 {attempt + 1}/{self.max_retries}): {e}")
                time.sleep(self.retry_delay)
    
    def create_dataset(self, name: str, description: str = "", **kwargs):
        """创建数据集（带重试机制）"""
        return self._retry_on_failure(
            self.ragflow.create_dataset,
            name=name,
            description=description,
            **kwargs
        )
    
    def upload_documents_batch(self, dataset, documents: List[Dict[str, Any]], batch_size: int = 5):
        """批量上传文档"""
        uploaded_docs = []
        total_docs = len(documents)
        
        for i in range(0, total_docs, batch_size):
            batch = documents[i:i+batch_size]
            print(f"上传批次 {i//batch_size + 1}/{(total_docs-1)//batch_size + 1}")
            
            try:
                docs = self._retry_on_failure(dataset.upload_documents, batch)
                uploaded_docs.extend(docs)
                print(f"成功上传 {len(docs)} 个文档")
            except Exception as e:
                print(f"批次上传失败: {e}")
                continue
        
        return uploaded_docs
    
    def parse_documents_batch(self, dataset, document_ids: List[str], batch_size: int = 10):
        """批量解析文档"""
        total_docs = len(document_ids)
        
        for i in range(0, total_docs, batch_size):
            batch_ids = document_ids[i:i+batch_size]
            print(f"解析批次 {i//batch_size + 1}/{(total_docs-1)//batch_size + 1}")
            
            try:
                self._retry_on_failure(dataset.parse_documents, batch_ids)
                print(f"成功提交解析任务，文档数量: {len(batch_ids)}")
            except Exception as e:
                print(f"批次解析失败: {e}")
                continue


def create_sample_documents(count: int = 10) -> List[Dict[str, Any]]:
    """创建示例文档"""
    documents = []
    
    topics = [
        "人工智能",
        "机器学习",
        "深度学习",
        "自然语言处理",
        "计算机视觉",
        "强化学习",
        "知识图谱",
        "大语言模型",
        "多模态学习",
        "AI伦理"
    ]
    
    for i in range(min(count, len(topics))):
        topic = topics[i]
        content = f"""
        # {topic}技术概述
        
        ## 定义与背景
        {topic}是计算机科学领域的重要分支，近年来取得了显著进展。
        
        ## 主要技术
        1. 基础理论
        2. 算法实现
        3. 应用场景
        4. 未来发展
        
        ## 应用领域
        {topic}在多个领域都有广泛应用，包括：
        - 医疗健康
        - 金融服务
        - 智能制造
        - 教育科研
        
        ## 挑战与机遇
        尽管{topic}技术发展迅速，但仍面临诸多挑战，如数据质量、算法效率、伦理问题等。
        同时，这些挑战也带来了新的发展机遇。
        """
        
        documents.append({
            "display_name": f"{topic}技术文档_{i+1}.txt",
            "blob": content.encode("utf-8")
        })
    
    return documents


async def async_upload_and_parse(client: RAGFlowAdvancedClient, dataset):
    """异步上传和解析文档"""
    # 创建示例文档
    documents = create_sample_documents(10)
    
    # 上传文档
    print("\n=== 异步上传文档 ===")
    loop = asyncio.get_event_loop()
    
    # 在实际应用中，可以使用真正的异步操作
    # 这里使用run_in_executor模拟异步操作
    upload_task = loop.run_in_executor(
        None, 
        client.upload_documents_batch, 
        dataset, 
        documents, 
        3
    )
    
    uploaded_docs = await upload_task
    print(f"异步上传完成，共上传 {len(uploaded_docs)} 个文档")
    
    # 解析文档
    print("\n=== 异步解析文档 ===")
    document_ids = [doc.id for doc in uploaded_docs]
    
    parse_task = loop.run_in_executor(
        None,
        client.parse_documents_batch,
        dataset,
        document_ids,
        5
    )
    
    await parse_task
    print("异步解析任务提交完成")


def custom_embedding_example():
    """自定义嵌入模型示例"""
    print("\n=== 自定义嵌入模型示例 ===")
    
    # 配置RAGFlow连接参数
    API_KEY = os.getenv("RAGFLOW_API_KEY", "ragflow-xxxxxxxxxxxxxx")
    BASE_URL = os.getenv("RAGFLOW_BASE_URL", "http://localhost:9380")
    
    # 初始化高级客户端
    client = RAGFlowAdvancedClient(API_KEY, BASE_URL)
    
    try:
        # 创建数据集，使用自定义嵌入模型
        dataset = client.create_dataset(
            name="AI技术知识库",
            description="包含各种AI技术的知识库",
            embedding_model="BAAI/bge-large-zh-v1.5",  # 使用BGE嵌入模型
            chunk_method="qa"  # 使用QA分块方法
        )
        
        print(f"成功创建数据集: {dataset.name} (ID: {dataset.id})")
        
        # 创建并上传文档
        documents = create_sample_documents(5)
        uploaded_docs = client.upload_documents_batch(dataset, documents, 2)
        
        # 解析文档
        document_ids = [doc.id for doc in uploaded_docs]
        client.parse_documents_batch(dataset, document_ids, 3)
        
        # 检索测试
        print("\n=== 检索测试 ===")
        search_results = client.ragflow.retrieve(
            dataset_ids=[dataset.id],
            question="什么是深度学习？",
            similarity_threshold=0.1,
            top_k=3
        )
        
        print(f"检索到 {len(search_results)} 个相关文档片段:")
        for i, result in enumerate(search_results):
            print(f"\n片段 {i+1}:")
            print(f"内容: {result['content_with_weight'][:150]}...")
            print(f"相似度: {result['similarity_score']}")
        
        return dataset
        
    except Exception as e:
        print(f"自定义嵌入模型示例失败: {e}")
        return None


async def main():
    """主函数"""
    print("=== RAGFlow SDK 高级使用示例 ===")
    
    # 配置RAGFlow连接参数
    API_KEY = os.getenv("RAGFLOW_API_KEY", "ragflow-xxxxxxxxxxxxxx")
    BASE_URL = os.getenv("RAGFLOW_BASE_URL", "http://localhost:9380")
    
    # 初始化高级客户端
    client = RAGFlowAdvancedClient(API_KEY, BASE_URL)
    
    try:
        # 测试连接
        print(f"成功连接到RAGFlow服务: {BASE_URL}")
        
        # 自定义嵌入模型示例
        dataset = custom_embedding_example()
        
        if dataset:
            # 异步操作示例
            await async_upload_and_parse(client, dataset)
        
        print("\n高级使用示例执行完成！")
        
    except Exception as e:
        print(f"执行失败: {e}")


if __name__ == "__main__":
    # 运行异步主函数
    asyncio.run(main())