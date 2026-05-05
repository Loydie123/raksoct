import api from '../axios';
import type { ServiceRequest, PaginatedResponse } from '../../types';

export interface ServiceRequestFilters {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
}

export interface CreateServiceRequestPayload {
  student_id: number;
  service_type: string;
  date_requested: string;
  remarks?: string;
}

export const serviceRequestService = {
  async getAll(filters: ServiceRequestFilters = {}): Promise<PaginatedResponse<ServiceRequest>> {
    const params: Record<string, string | number> = { page: filters.page || 1 };
    
    if (filters.status) params.status = filters.status;
    if (filters.dateFrom) params.date_from = filters.dateFrom;
    if (filters.dateTo) params.date_to = filters.dateTo;

    const response = await api.get<PaginatedResponse<ServiceRequest>>('/service-requests', { params });
    return response.data;
  },

  async getById(id: number): Promise<ServiceRequest> {
    const response = await api.get<ServiceRequest>(`/service-requests/${id}`);
    return response.data;
  },

  async create(data: CreateServiceRequestPayload): Promise<ServiceRequest> {
    const response = await api.post<ServiceRequest>('/service-requests', data);
    return response.data;
  },

  async approve(id: number, remarks?: string): Promise<ServiceRequest> {
    const response = await api.post<ServiceRequest>(`/service-requests/${id}/approve`, { remarks });
    return response.data;
  },

  async reject(id: number, remarks: string): Promise<ServiceRequest> {
    const response = await api.post<ServiceRequest>(`/service-requests/${id}/reject`, { remarks });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/service-requests/${id}`);
  },
};
