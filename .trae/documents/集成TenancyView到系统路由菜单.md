# 集成TenancyView到系统路由菜单

## 1. 路由配置
- 在 `routes.ts` 中添加TenancyView的路由枚举值
- 在admin路由配置中添加TenancyView的路由条目

## 2. 菜单配置
- 在 `navigation-layout.tsx` 中添加TenancyView的菜单项
- 确保菜单项显示名称、图标、权限控制等与departments保持一致的设计规范

## 3. 组件导出
- 确保TenancyView组件正确导出，以便路由可以引用

## 4. 验证功能
- 验证路由跳转功能正常
- 验证菜单项正确显示且高亮状态切换正常
- 确保权限控制逻辑正确应用于新添加的菜单和路由

## 具体实现步骤

1. **修改 `routes.ts`**
   - 在Routes枚举中添加 `AdminTenancy` 路由常量
   - 在admin routes数组中添加TenancyView的路由配置

2. **修改 `navigation-layout.tsx`**
   - 导入TenancyView使用的图标
   - 在navItems数组中添加TenancyView的菜单项
   - 确保菜单项配置与departments保持一致

3. **修改 `TenancyView.tsx`**
   - 确保组件正确导出为默认导出，以便路由可以引用

4. **验证实现**
   - 检查路由配置是否正确
   - 检查菜单配置是否正确
   - 确保权限控制逻辑正确应用

## 预期结果
- 系统菜单中显示"租户管理"菜单项
- 点击菜单项可以正确跳转到TenancyView页面
- 页面高亮状态切换正常
- 权限控制逻辑正确应用

## 技术要点
- 遵循系统现有的路由配置模式
- 遵循系统现有的菜单配置模式
- 确保组件导出方式正确
- 确保权限控制逻辑正确应用

## 注意事项
- 确保路由路径与菜单配置中的路径一致
- 确保图标使用与系统其他菜单项保持一致
- 确保权限控制逻辑与系统其他菜单项保持一致