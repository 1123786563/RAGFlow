## 问题分析

在`common/constants.py`文件中，第191行的`ENV_MAX_CONCURRENT_TASKS`定义被注释掉了：
```python
# ENV_MAX_CONCURRENT_TASKS = "MAX_CONCURRENT_TASKS"
```

然而，在实际代码中，这个环境变量被广泛使用：
1. `rag/svr/task_executor.py`：用于限制并发任务数量，默认值为5
2. `rag/svr/sync_data_source.py`：同样用于限制并发任务数量，默认值为5

## 解决方案

1. **恢复环境变量定义**：取消注释`common/constants.py`中的`ENV_MAX_CONCURRENT_TASKS`定义
2. **统一使用常量**：修改`task_executor.py`和`sync_data_source.py`，使用常量而非直接引用环境变量名
3. **保持一致性**：确保所有相关代码使用统一的常量定义

## 实施步骤

1. 编辑`common/constants.py`文件，取消注释第191行的`ENV_MAX_CONCURRENT_TASKS`定义
2. 编辑`rag/svr/task_executor.py`文件，将直接引用的`MAX_CONCURRENT_TASKS`环境变量替换为常量引用
3. 编辑`rag/svr/sync_data_source.py`文件，同样将直接引用的`MAX_CONCURRENT_TASKS`环境变量替换为常量引用
4. 验证修改后的代码是否能正常运行

## 预期效果

- 代码中环境变量的使用更加统一和规范
- 便于后续维护和管理环境变量
- 减少因环境变量名拼写错误导致的问题
- 提高代码的可读性和可维护性