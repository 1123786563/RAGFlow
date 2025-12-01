import * as LucideIcons from 'lucide-react';
import React, { useMemo } from 'react';

interface MenuIconProps {
  iconName: string;
}

/**
 * 菜单图标组件
 * 根据图标名称渲染对应的Lucide图标
 */
export const MenuIcon: React.FC<MenuIconProps> = React.memo(({ iconName }) => {
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

  // 使用useMemo缓存图标渲染结果
  const icon = useMemo(() => {
    return renderIcon(iconName);
  }, [iconName]);

  return (
    <div className="p-1 bg-slate-100 rounded text-slate-500">
      {icon}
    </div>
  );
});

// 添加显示名称，便于调试
MenuIcon.displayName = 'MenuIcon';
