import {
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  EyeOff,
  Plus,
} from 'lucide-react';
import React from 'react';
import { MenuItem } from '../types/index';
import { MenuIcon } from './MenuIcon';

interface MenuRowProps {
  menu: MenuItem;
  depth: number;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onAddSubMenu: (id: string) => void;
  onEdit: (id: string) => void;
}

/**
 * 菜单行组件
 * 渲染单个菜单行，支持展开/折叠、添加子菜单和编辑功能
 */
export const MenuRow: React.FC<MenuRowProps> = ({
  menu,
  depth,
  isExpanded,
  onToggleExpand,
  onAddSubMenu,
  onEdit,
}) => {
  const hasChildren = menu.children && menu.children.length > 0;

  return (
    <tr key={menu.id} className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
        <div
          className="flex items-center"
          style={{ paddingLeft: `${depth * 24}px` }}
        >
          {hasChildren ? (
            <button
              onClick={() => onToggleExpand(menu.id)}
              className="p-0.5 rounded hover:bg-slate-200 text-slate-400 mr-2 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          ) : (
            <span className="w-4 mr-2 inline-block"></span>
          )}
          {menu.title}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
        {menu.path}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 flex items-center gap-2">
        <MenuIcon iconName={menu.icon} />
        {menu.icon}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
        {menu.sortOrder}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div
          className={`flex items-center text-xs px-2 py-0.5 rounded-full w-fit ${menu.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
        >
          {menu.visible ? (
            <Eye size={12} className="mr-1" />
          ) : (
            <EyeOff size={12} className="mr-1" />
          )}
          {menu.visible ? '显示' : '隐藏'}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onAddSubMenu(menu.id)}
          className="text-slate-400 hover:text-brand-600 mr-2"
          title="Add Sub-menu"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => onEdit(menu.id)}
          className="text-brand-600 hover:text-brand-900"
          title="Edit Menu"
        >
          <Edit size={16} />
        </button>
      </td>
    </tr>
  );
};
