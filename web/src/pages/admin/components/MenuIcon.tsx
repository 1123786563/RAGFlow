import * as LucideIcons from 'lucide-react';
import React from 'react';

interface MenuIconProps {
  iconName: string;
}

/**
 * 菜单图标组件
 * 根据图标名称渲染对应的Lucide图标
 */
export const MenuIcon: React.FC<MenuIconProps> = ({ iconName }) => {
  /**
   * 渲染图标
   * @param name 图标名称
   * @returns 图标组件
   */
  const renderIcon = (name: string) => {
    // @ts-ignore - 动态获取Lucide图标组件
    const Icon = LucideIcons[name];
    return Icon ? <Icon size={16} /> : <LucideIcons.Circle size={10} />;
  };

  return (
    <div className="p-1 bg-slate-100 rounded text-slate-500">
      {renderIcon(iconName)}
    </div>
  );
};
