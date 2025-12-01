import { api } from '@/utils/api';
import request from '../request';

const { adminListUsers, adminCreateUser, adminGetUserDetails, adminUpdateUserStatus, adminUpdateUserPassword, adminDeleteUser, adminListUserDatasets, adminListUserAgents } = api;

export const listUsers = () =>
  request.get<ResponseData<AdminService.ListUsersItem[]>>(adminListUsers, {});

export const createUser = (email: string, password: string) =>
  request.post<ResponseData<boolean>>(adminCreateUser, {
    username: email,
    password,
  });

export const getUserDetails = (email: string) =>
  request.get<ResponseData<[AdminService.UserDetail]>>(adminGetUserDetails(email));

export const listUserDatasets = (email: string) =>
  request.get<ResponseData<AdminService.ListUserDatasetItem[]>>(adminListUserDatasets(email));

export const listUserAgents = (email: string) =>
  request.get<ResponseData<AdminService.ListUserAgentItem[]>>(adminListUserAgents(email));

export const updateUserStatus = (email: string, status: 'on' | 'off') =>
  request.put(adminUpdateUserStatus(email), { activate_status: status });

export const updateUserPassword = (email: string, password: string) =>
  request.put(adminUpdateUserPassword(email), { new_password: password });

export const deleteUser = (email: string) =>
  request.delete(adminDeleteUser(email));
