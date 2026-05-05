import api from '../axios';
import type { ImportLog, PaginatedResponse } from '../../types';

export interface UploadResponse {
  message: string;
  import_log_id: number;
}

export const importService = {
  async getLogs(): Promise<PaginatedResponse<ImportLog>> {
    const response = await api.get<PaginatedResponse<ImportLog>>('/import/logs');
    return response.data;
  },

  async upload(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<UploadResponse>('/import/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
