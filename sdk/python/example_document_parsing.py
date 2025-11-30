#!/usr/bin/env python3
"""
RAGFlow SDK 文档解析示例

本示例展示如何使用RAGFlow Python SDK进行文档解析：
1. 使用不同的解析方法
2. 自定义解析配置
3. 处理不同类型的文档
4. 批量文档处理
"""

import os
import sys
import json
from pathlib import Path

# 添加SDK路径到Python路径
sdk_path = Path(__file__).parent / "ragflow_sdk"
sys.path.insert(0, str(sdk_path))

from ragflow_sdk import RAGFlow
from ragflow_sdk.modules.dataset import DataSet


def create_sample_documents():
    """创建示例文档"""
    docs = []
    
    # 文本文档
    text_doc = """
    # 人工智能技术发展报告
    
    ## 概述
    
    人工智能（AI）技术在过去十年中取得了显著进展，特别是在深度学习、自然语言处理和计算机视觉领域。
    
    ## 主要技术领域
    
    ### 1. 深度学习
    深度学习是机器学习的一个子领域，它基于人工神经网络的结构和功能。深度学习模型能够从大量数据中学习复杂的模式。
    
    ### 2. 自然语言处理
    自然语言处理（NLP）是人工智能的一个分支，专注于计算机与人类语言之间的交互。NLP技术包括：
    - 文本分类
    - 命名实体识别
    - 情感分析
    - 机器翻译
    
    ### 3. 计算机视觉
    计算机视觉使计算机能够从数字图像或视频中获取高级理解。主要应用包括：
    - 图像分类
    - 目标检测
    - 图像分割
    
    ## 应用场景
    
    人工智能技术已广泛应用于各个领域：
    - 医疗健康：疾病诊断、药物研发
    - 金融服务：风险评估、欺诈检测
    - 自动驾驶：环境感知、路径规划
    - 智能制造：质量控制、预测性维护
    
    ## 未来展望
    
    随着计算能力的提升和算法的改进，人工智能技术将继续快速发展，并在更多领域发挥重要作用。
    """
    
    # 保存文本文档
    text_file = "/tmp/ai_report.txt"
    with open(text_file, "w", encoding="utf-8") as f:
        f.write(text_doc)
    
    docs.append({
        "path": text_file,
        "name": "人工智能技术发展报告.txt",
        "type": "text"
    })
    
    # Q&A文档
    qa_doc = """
    Q: 什么是RAGFlow？
    A: RAGFlow是一个基于深度文档理解的开源RAG（检索增强生成）引擎。
    
    Q: RAGFlow的主要功能是什么？
    A: RAGFlow的主要功能包括：
    1. 深度文档理解
    2. 高质量检索
    3. 可扩展的插件系统
    
    Q: RAGFlow支持哪些文档格式？
    A: RAGFlow支持多种文档格式，包括PDF、Word、Excel、PowerPoint、图片等。
    
    Q: 如何部署RAGFlow？
    A: RAGFlow可以通过Docker进行部署，也支持源码编译安装。
    
    Q: RAGFlow是否支持多语言？
    A: 是的，RAGFlow支持多种语言，包括中文、英文、日文等。
    """
    
    # 保存Q&A文档
    qa_file = "/tmp/ragflow_qa.txt"
    with open(qa_file, "w", encoding="utf-8") as f:
        f.write(qa_doc)
    
    docs.append({
        "path": qa_file,
        "name": "RAGFlow常见问题.txt",
        "type": "qa"
    })
    
    return docs


def create_parser_config(chunk_method):
    """创建解析配置"""
    if chunk_method == "naive":
        # 简单分块配置
        return DataSet.ParserConfig(None, {
            "chunk_token_num": 128,
            "layout_recognize": True,
            "html4excel": False,
            "html4pdf": False
        })
    elif chunk_method == "qa":
        # Q&A分块配置
        return DataSet.ParserConfig(None, {
            "chunk_token_num": 512,
            "layout_recognize": False,
            "html4excel": False,
            "html4pdf": False
        })
    elif chunk_method == "manual":
        # 手动分块配置
        return DataSet.ParserConfig(None, {
            "chunk_token_num": 256,
            "layout_recognize": True,
            "html4excel": False,
            "html4pdf": False
        })
    else:
        return None


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
    
    # 创建示例文档
    sample_docs = create_sample_documents()
    print(f"创建了 {len(sample_docs)} 个示例文档")
    
    # 测试不同的解析方法
    chunk_methods = ["naive", "qa", "manual"]
    
    for method in chunk_methods:
        print(f"\n=== 测试解析方法: {method} ===")
        
        try:
            # 创建数据集
            dataset_name = f"文档解析示例_{method}"
            dataset = ragflow.create_dataset(
                name=dataset_name,
                description=f"使用{method}方法解析的文档数据集",
                embedding_model="BAAI/bge-large-zh-v1.5",
                chunk_method=method,
                parser_config=create_parser_config(method)
            )
            print(f"成功创建数据集: {dataset.name} (ID: {dataset.id})")
            
            # 上传文档
            documents = []
            for doc in sample_docs:
                with open(doc["path"], "rb") as f:
                    uploaded_docs = dataset.upload_documents([{
                        "display_name": doc["name"],
                        "blob": f.read()
                    }])
                    documents.extend(uploaded_docs)
            
            print(f"成功上传 {len(documents)} 个文档")
            
            # 解析文档
            document_ids = [doc.id for doc in documents]
            results = dataset.parse_documents(document_ids)
            
            # 统计解析结果
            total_chunks = 0
            total_tokens = 0
            for doc_id, status, chunk_count, token_count in results:
                print(f"文档解析完成 - ID: {doc_id}, 状态: {status}, 块数: {chunk_count}, 令牌数: {token_count}")
                total_chunks += chunk_count
                total_tokens += token_count
            
            print(f"总计: {total_chunks} 个文档块, {total_tokens} 个令牌")
            
            # 列出文档块
            chunks = dataset.list_chunks(page=1, page_size=5)
            print(f"前5个文档块:")
            for i, chunk in enumerate(chunks):
                print(f"  {i+1}. {chunk.content[:100]}...")
            
        except Exception as e:
            print(f"测试解析方法 {method} 失败: {e}")
    
    # 清理临时文件
    for doc in sample_docs:
        if os.path.exists(doc["path"]):
            os.remove(doc["path"])
    
    print("\n文档解析示例执行完成！")


if __name__ == "__main__":
    main()