import { api } from '@/utils/api';
import request from '../request';

const { adminListServices, adminShowServiceDetails } = api;

export const listServices = () =>
  request.get<ResponseData<AdminService.ListServicesItem[]>>(adminListServices);

export const showServiceDetails = (serviceId: number) =>
  request.get<ResponseData<AdminService.ServiceDetail>>(adminShowServiceDetails(String(serviceId)));
