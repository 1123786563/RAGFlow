import { api } from '@/utils/api';
import request from '../request';

const { adminListRoles, adminListRolesWithPermission, adminCreateRole, adminDeleteRole, adminUpdateRoleDescription, adminGetRolePermissions, adminAssignRolePermissions, adminRevokeRolePermissions, adminGetUserPermissions, adminUpdateUserRole } = api;

export const listRoles = () =>
  request.get<ResponseData<{ roles: AdminService.ListRoleItem[]; total: number }>>(adminListRoles);

export const listRolesWithPermission = () =>
  request.get<ResponseData<{ roles: AdminService.ListRoleItemWithPermission[]; total: number }>>(adminListRolesWithPermission);

export const createRole = (params: { roleName: string; description?: string }) =>
  request.post<ResponseData<AdminService.RoleDetail>>(adminCreateRole, params);

export const deleteRole = (role: string) =>
  request.delete<ResponseData<ResponseData<never>>>(adminDeleteRole(role));

export const updateRoleDescription = (role: string, description: string) =>
  request.put<ResponseData<AdminService.RoleDetail>>(adminUpdateRoleDescription(role), { description });

export const getRolePermissions = (role: string) =>
  request.get<ResponseData<AdminService.RoleDetailWithPermission>>(adminGetRolePermissions(role));

export const assignRolePermissions = (role: string, permissions: Partial<AdminService.AssignRolePermissionsInput>) =>
  request.post<ResponseData<never>>(adminAssignRolePermissions(role), { new_permissions: permissions });

export const revokeRolePermissions = (role: string, permissions: Partial<AdminService.RevokeRolePermissionInput>) =>
  request.delete<ResponseData<never>>(adminRevokeRolePermissions(role), { data: { revoke_permissions: permissions } });

export const updateUserRole = (username: string, role: string) =>
  request.put<ResponseData<never>>(adminUpdateUserRole(username), { role_name: role });

export const getUserPermissions = (username: string) =>
  request.get<ResponseData<AdminService.UserDetailWithPermission>>(adminGetUserPermissions(username));
