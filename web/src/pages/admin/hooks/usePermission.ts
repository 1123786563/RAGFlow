import { useState, useEffect } from 'react';
import authorizationUtil from '@/utils/authorization-util';

/**
 * 权限检查钩子
 * 用于检查用户是否具有特定权限
 */
export const usePermission = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 获取用户信息
    const info = authorizationUtil.getUserInfoObject();
    setUserInfo(info);
    setIsLoading(false);
  }, []);

  /**
   * 检查用户是否具有特定角色
   * @param roles 允许的角色列表
   * @returns 是否具有权限
   */
  const hasRole = (roles: string[]): boolean => {
    if (isLoading || !userInfo) return false;
    return roles.includes(userInfo.role) || userInfo.is_superuser;
  };

  /**
   * 检查用户是否具有特定权限
   * @param permission 权限名称
   * @returns 是否具有权限
   */
  const hasPermission = (permission: string): boolean => {
    if (isLoading || !userInfo) return false;
    if (userInfo.is_superuser) return true;
    return userInfo.permissions?.includes(permission) || false;
  };

  /**
   * 检查用户是否为超级管理员
   * @returns 是否为超级管理员
   */
  const isSuperuser = (): boolean => {
    if (isLoading || !userInfo) return false;
    return userInfo.is_superuser;
  };

  return {
    userInfo,
    isLoading,
    hasRole,
    hasPermission,
    isSuperuser,
  };
};
