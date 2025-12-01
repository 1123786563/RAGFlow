# 将三个Admin视图文件加载到菜单路由中

## 1. 分析当前状态

### 1.1 路由配置
- 路由配置文件：`/Users/yongjunwu/trea/ragflow/web/src/routes.ts`
- 当前已配置的admin路由：services、users、whitelist、roles、monitoring、departments、tenancy
- 缺少的路由：audit、menus、notification

### 1.2 菜单配置
- 菜单配置文件：`/Users/yongjunwu/trea/ragflow/web/src/pages/admin/layouts/navigation-layout.tsx`
- 当前已配置的admin菜单项：服务状态、用户管理、部门管理、注册白名单、角色管理、监控
- 缺少的菜单项：审计日志、菜单管理、通知模板

## 2. 实现计划

### 2.1 路由配置
- 在 Routes 枚举中添加三个视图的路由常量
- 在 admin routes 数组中添加三个视图的路由配置

### 2.2 菜单配置
- 在 navigation-layout.tsx 中添加三个视图的菜单项
- 确保菜单项的图标、名称和权限控制与现有菜单项保持一致

### 2.3 验证实现
- 检查路由配置是否正确
- 检查菜单配置是否正确
- 确保权限控制逻辑正确应用

## 具体实现步骤

### 3.1 修改 routes.ts
1. 在 Routes 枚举中添加三个视图的路由常量：
   - `AdminAudit = `${Admin}/audit``
   - `AdminMenus = `${Admin}/menus``
   - `AdminNotification = `${Admin}/notification``

2. 在 admin routes 数组中添加三个视图的路由配置：
   ```typescript
   { path: Routes.AdminAudit, component: `@/pages/admin/AuditView` }
   { path: Routes.AdminMenus, component: `@/pages/admin/MenusView` }
   { path: Routes.AdminNotification, component: `@/pages/admin/NotificationView` }
   ```

### 3.2 修改 navigation-layout.tsx
1. 导入三个视图使用的图标：
   - `LucideFileText` 用于审计日志
   - `LucideMenu` 用于菜单管理
   - `LucideBell` 用于通知模板

2. 在 navItems 数组中添加三个视图的菜单项：
   ```typescript
   {
     path: Routes.AdminAudit,
     name: t('admin.audit'),
     icon: <LucideFileText className="size-[1em]" />
   },
   {
     path: Routes.AdminMenus,
     name: t('admin.menus'),
     icon: <LucideMenu className="size-[1em]" />
   },
   {
     path: Routes.AdminNotification,
     name: t('admin.notification'),
     icon: <LucideBell className="size-[1em]" />
   }
   ```

## 预期结果
- 系统菜单中显示"审计日志"、"菜单管理"和"通知模板"菜单项
- 点击菜单项可以正确跳转到对应的视图页面
- 页面高亮状态切换正常
- 权限控制逻辑正确应用

## 技术要点
- 遵循系统现有的路由配置模式
- 遵循系统现有的菜单配置模式
- 确保路由路径与菜单配置中的路径一致
- 确保图标使用与系统其他菜单项保持一致
- 确保权限控制逻辑与系统其他菜单项保持一致

## 注意事项
- 保持路由配置与菜单配置的一致性
- 遵循系统现有的命名规范
- 确保组件导出方式正确
- 确保权限控制逻辑正确应用