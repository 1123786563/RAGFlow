## 修复 Admin 页面导入路径错误

### 问题分析
从报错信息和文件结构分析，发现主要是导入路径错误导致构建失败。具体问题包括：
1. 组件导入路径缺少子目录前缀（如 `./components/AuditDetailModal` 应为 `./components/audit/AuditDetailModal`）
2. API 导入路径层级错误（如 `./api` 应为 `../api`）
3. 工具函数和钩子导入路径错误
4. 一些文件位置与导入路径不匹配

### 修复方案

#### 1. 修复 API 导入路径
- 将所有 admin 页面中的 API 导入路径统一修改为 `../api`
- 涉及文件：`audit/audit.tsx`、`menus/menus.tsx`、`tenancy/tenancy.tsx`、`notification/notification.tsx`、`ops/ops.tsx`、`security/security.tsx`、`tasks/tasks.tsx`、`departments/departments.tsx`

#### 2. 修复组件导入路径
- 修正组件导入路径，添加正确的子目录前缀
- 涉及文件：
  - `audit/audit.tsx`：组件路径添加 `audit/` 前缀
  - `menus/menus.tsx`：组件路径添加 `menus/` 前缀
  - `notification/notification.tsx`：组件路径添加 `common/` 前缀
  - `departments/departments.tsx`：组件路径添加 `common/` 前缀
  - `users/user-detail.tsx` 和 `users/users.tsx`：组件路径添加 `common/` 前缀
  - `services/service-status.tsx`：修复 `task-executor-detail` 导入路径

#### 3. 修复工具函数和钩子导入路径
- 修正 `useApiData`、`utils` 等导入路径
- 涉及文件：`tenancy/tenancy.tsx`、`users/user-detail.tsx`、`users/users.tsx`、`services/service-status.tsx`

#### 4. 修复其他导入路径
- 修复 `theme-switch`、`login-next/bg` 等导入路径
- 涉及文件：`layouts/navigation-layout.tsx`、`login/login.tsx`

### 修复步骤
1. 批量修改所有 API 导入路径为 `../api`
2. 逐个修复组件导入路径，添加正确的子目录前缀
3. 修复工具函数和钩子导入路径
4. 修复其他零散的导入路径错误
5. 运行构建命令验证修复结果

### 预期结果
- 所有导入路径错误修复完成
- 项目能够成功构建
- 所有 Admin 页面能够正常访问和使用