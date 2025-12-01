import { api } from '@/utils/api';
import request from '../request';

const { adminListWhitelist, adminCreateWhitelistEntry, adminUpdateWhitelistEntry, adminDeleteWhitelistEntry, adminImportWhitelist } = api;

export const listWhitelist = () =>
  request.get<ResponseData<{ total: number; white_list: AdminService.ListWhitelistItem[] }>>(adminListWhitelist);

export const createWhitelistEntry = (email: string) =>
  request.post<ResponseData<never>>(adminCreateWhitelistEntry, { email });

export const updateWhitelistEntry = (id: number, email: string) =>
  request.put<ResponseData<never>>(adminUpdateWhitelistEntry(id), { email });

export const deleteWhitelistEntry = (email: string) =>
  request.delete<ResponseData<never>>(adminDeleteWhitelistEntry(email));

export const importWhitelistFromExcel = (file: File) => {
  const fd = new FormData();
  fd.append('file', file);
  return request.post<ResponseData<never>>(adminImportWhitelist, fd);
};
