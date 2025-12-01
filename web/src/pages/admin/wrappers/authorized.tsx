import { Routes } from '@/routes';
import authorizationUtil from '@/utils/authorization-util';
import { Navigate, Outlet, useLocation } from 'umi';

interface AuthorizedAdminWrapperProps {
  allowedRoles?: string[];
}

/**
 * 授权包装器
 * 支持基于角色的访问控制（RBAC）
 */
export default function AuthorizedAdminWrapper({ allowedRoles }: AuthorizedAdminWrapperProps) {
  const isLogin = !!authorizationUtil.getAuthorization();
  const location = useLocation();
  
  if (!isLogin) {
    return <Navigate to={Routes.Admin} state={{ from: location }} />;
  }
  
  // 如果没有指定允许的角色，则所有登录用户都可以访问
  if (!allowedRoles || allowedRoles.length === 0) {
    return <Outlet />;
  }
  
  // 获取用户信息
  const userInfo = authorizationUtil.getUserInfoObject();
  const userRole = userInfo?.role || '';
  
  // 检查用户角色是否在允许的角色列表中
  if (allowedRoles.includes(userRole) || userInfo?.is_superuser) {
    return <Outlet />;
  }
  
  // 如果用户角色不在允许的角色列表中，则重定向到403页面
  return <Navigate to={Routes.NotFound} />;
}
