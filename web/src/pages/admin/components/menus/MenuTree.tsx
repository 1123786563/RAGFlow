import React, { useMemo } from 'react';
import { MenuItem } from '../../types/index';
import { MenuRow } from './MenuRow';

interface MenuTreeProps {
  menus: MenuItem[];
  expandedRowIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onAddSubMenu: (id: string) => void;
  onEdit: (id: string) => void;
  depth?: number;
}

/**
 * 菜单树组件
 * 递归渲染树形菜单结构
 */
export const MenuTree: React.FC<MenuTreeProps> = React.memo(({
  menus,
  expandedRowIds,
  onToggleExpand,
  onAddSubMenu,
  onEdit,
  depth = 0,
}) => {
  /**
   * 渲染菜单行和子菜单
   * @param nodes 菜单节点数组
   * @param currentDepth 当前深度
   * @returns 菜单行和子菜单的JSX元素数组
   */
  const renderRows = (nodes: MenuItem[], currentDepth: number) => {
    return nodes.flatMap((menu) => {
      const hasChildren = menu.children && menu.children.length > 0;
      const isExpanded = expandedRowIds.has(menu.id);

      const row = (
        <MenuRow
          key={menu.id}
          menu={menu}
          depth={currentDepth}
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          onAddSubMenu={onAddSubMenu}
          onEdit={onEdit}
        />
      );

      const childrenRows =
        hasChildren && isExpanded
          ? renderRows(menu.children!, currentDepth + 1)
          : [];

      return [row, ...childrenRows];
    });
  };

  // 使用useMemo缓存渲染结果，只有当依赖项变化时才重新渲染
  const menuRows = useMemo(() => {
    return renderRows(menus, depth);
  }, [menus, expandedRowIds, onToggleExpand, onAddSubMenu, onEdit, depth]);

  return <>{menuRows}</>;
});

// 添加显示名称，便于调试
MenuTree.displayName = 'MenuTree';
