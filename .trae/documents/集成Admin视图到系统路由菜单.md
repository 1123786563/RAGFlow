# 集成Admin视图到系统路由菜单

## 实施步骤

### 1. 修改路由配置文件 (`/Users/yongjunwu/trea/ragflow/web/src/routes.ts`)

#### 1.1 添加路由枚举值
在 `Routes` 枚举中添加以下新的路由路径：
```typescript
// Admin routes extension
AdminExtension = `${Admin}/extension`,
AdminOps = `${Admin}/ops`,
AdminSecurity = `${Admin}/security`,
AdminSettings = `${Admin}/settings`,
AdminTasks = `${Admin}/tasks`,
```

#### 1.2 添加路由配置
在Admin路由组的 `routes` 数组中添加以下路由条目：
```typescript
{
  path: Routes.AdminExtension,
  component: `@/pages/admin/extension`,
},
{
  path: Routes.AdminOps,
  component: `@/pages/admin/ops`,
},
{
  path: Routes.AdminSecurity,
  component: `@/pages/admin/security`,
},
{
  path: Routes.AdminSettings,
  component: `@/pages/admin/settings`,
},
{
  path: Routes.AdminTasks,
  component: `@/pages/admin/tasks`,
},
```

### 2. 修改导航布局文件 (`/Users/yongjunwu/trea/ragflow/web/src/pages/admin/layouts/navigation-layout.tsx`)

#### 2.1 添加图标导入
添加所需的图标导入：
```typescript
import {
  // 现有的图标...
  LucideBox,
  LucideDatabase,
  LucideShield,
  LucideSettings,
  LucideTasks,
} from 'lucide-react';
```

#### 2.2 添加导航菜单项
在 `navItems` 数组中添加以下新的菜单项：
```typescript
{
  path: Routes.AdminExtension,
  name: t('admin.menus.extension'),
  icon: <LucideBox className="size-[1em]" />,
},
{
  path: Routes.AdminOps,
  name: t('admin.menus.ops'),
  icon: <LucideDatabase className="size-[1em]" />,
},
{
  path: Routes.AdminSecurity,
  name: t('admin.menus.security'),
  icon: <LucideShield className="size-[1em]" />,
},
{
  path: Routes.AdminSettings,
  name: t('admin.menus.settings'),
  icon: <LucideSettings className="size-[1em]" />,
},
{
  path: Routes.AdminTasks,
  name: t('admin.menus.tasks'),
  icon: <LucideTasks className="size-[1em]" />,
},
```

### 3. 重命名文件（移除View后缀）

将以下文件重命名，移除"View"后缀：
- `ExtensionView.tsx` -> `extension.tsx`
- `OpsView.tsx` -> `ops.tsx`
- `SecurityView.tsx` -> `security.tsx`
- `SettingsView.tsx` -> `settings.tsx`
- `TasksView.tsx` -> `tasks.tsx`

## 命名规则说明

- 路由路径：使用小写字母加连字符，如 `/admin/extension`
- 组件文件名：使用小写字母，移除"View"后缀，如 `extension.tsx`
- 路由枚举：使用大驼峰命名，如 `AdminExtension`
- 菜单名称：使用i18n翻译键，如 `t('admin.menus.extension')`

## 预期效果

1. 系统路由中添加了5个新的Admin路由条目
2. Admin导航菜单中显示了5个新的菜单项
3. 点击菜单项可以正确导航到对应的页面
4. 文件命名符合系统的命名规范

## 注意事项

1. 确保路由路径与组件文件路径匹配
2. 确保图标导入正确且与功能匹配
3. 遵循系统现有的代码风格和命名规范
4. 确保路由配置中的组件引用使用正确的路径格式