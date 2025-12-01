import { api } from '@/utils/api';
import request from '../request';

const { adminLogin, adminLogout, adminGetSystemVersion } = api;

export const login = (params: { email: string; password: string }) =>
  request.post<ResponseData<AdminService.LoginData>>(adminLogin, params);

export const logout = () => request.get<ResponseData<boolean>>(adminLogout);

export const getSystemVersion = () =>
  request.get<ResponseData<{ version: string }>>(adminGetSystemVersion);
