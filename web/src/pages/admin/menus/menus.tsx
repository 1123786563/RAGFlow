import React, { useState } from 'react';
import { MenuApi } from '../api';

// 导入子组件
import { MenuTree } from '../components/menus/MenuTree';

/**
 * 菜单管理视图组件
 * 提供菜单的树形结构展示、添加子菜单和编辑功能
 */
const MenusView: React.FC = () => {
  // 获取菜单数据
  const MENUS = MenuApi.list();

  // 展开状态管理
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(
    new Set(['1', '3']),
  );

  /**
   * 切换菜单展开/折叠状态
   * @param id 菜单ID
   */
  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedRowIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRowIds(newSet);
  };

  /**
   * 添加子菜单
   * @param id 父菜单ID
   */
  const handleAddSubMenu = (id: string) => {
    // TODO: 实现添加子菜单功能
    console.log('Add submenu to:', id);
  };

  /**
   * 编辑菜单
   * @param id 菜单ID
   */
  const handleEdit = (id: string) => {
    // TODO: 实现编辑菜单功能
    console.log('Edit menu:', id);
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white animate-fade-in-up">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              标题 (树形)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              路由路径
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              图标
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              排序
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
              可见性
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          <MenuTree
            menus={MENUS}
            expandedRowIds={expandedRowIds}
            onToggleExpand={toggleExpand}
            onAddSubMenu={handleAddSubMenu}
            onEdit={handleEdit}
          />
        </tbody>
      </table>
    </div>
  );
};

export default MenusView;
