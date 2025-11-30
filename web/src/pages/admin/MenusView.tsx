import * as LucideIcons from 'lucide-react';
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  EyeOff,
  Plus,
} from 'lucide-react';
import React, { useState } from 'react';
import { MenuApi } from './api';
import { MenuItem } from './types/index';

export const MenusView: React.FC = () => {
  const MENUS = MenuApi.list();
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(
    new Set(['1', '3']),
  );

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedRowIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRowIds(newSet);
  };

  const renderIcon = (iconName: string) => {
    // @ts-ignore
    const Icon = LucideIcons[iconName];
    return Icon ? <Icon size={16} /> : <LucideIcons.Circle size={10} />;
  };

  const renderRows = (nodes: MenuItem[], depth: number = 0) => {
    return nodes.flatMap((menu) => {
      const hasChildren = menu.children && menu.children.length > 0;
      const isExpanded = expandedRowIds.has(menu.id);

      const row = (
        <tr key={menu.id} className="hover:bg-slate-50 transition-colors">
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
            <div
              className="flex items-center"
              style={{ paddingLeft: `${depth * 24}px` }}
            >
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(menu.id)}
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
            <div className="p-1 bg-slate-100 rounded text-slate-500">
              {renderIcon(menu.icon)}
            </div>
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
              className="text-slate-400 hover:text-brand-600 mr-2"
              title="Add Sub-menu"
            >
              <Plus size={16} />
            </button>
            <button className="text-brand-600 hover:text-brand-900">
              <Edit size={16} />
            </button>
          </td>
        </tr>
      );

      const childrenRows =
        hasChildren && isExpanded ? renderRows(menu.children!, depth + 1) : [];
      return [row, ...childrenRows];
    });
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
          {renderRows(MENUS)}
        </tbody>
      </table>
    </div>
  );
};
