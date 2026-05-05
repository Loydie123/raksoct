import api from '../axios';
import type { Student, PaginatedResponse } from '../../types';

export interface StudentFilters {
  search?: string;
  status?: string;
  page?: number;
}

export interface CreateStudentPayload {
  student_number: string;
  first_name: string;
  last_name: string;
  grade_level: string;
  email: string;
  status: 'active' | 'inactive';
}

export type UpdateStudentPayload = Partial<CreateStudentPayload>;

export const studentService = {
  async getAll(filters: StudentFilters = {}): Promise<PaginatedResponse<Student>> {
    const params: Record<string, string | number> = { page: filters.page || 1 };
    
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;

    const response = await api.get<PaginatedResponse<Student>>('/students', { params });
    return response.data;
  },

  async getById(id: number): Promise<Student> {
    const response = await api.get<Student>(`/students/${id}`);
    return response.data;
  },

  async create(data: CreateStudentPayload): Promise<Student> {
    const response = await api.post<Student>('/students', data);
    return response.data;
  },

  async update(id: number, data: UpdateStudentPayload): Promise<Student> {
    const response = await api.put<Student>(`/students/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/students/${id}`);
  },
};
