import api from './axios';
import { ApiResponse, Lead, LeadFilters, CreateLeadDto, UpdateLeadDto, User } from '../types';

export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', data).then(r => r.data),
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', data).then(r => r.data),
  getMe: () =>
    api.get<ApiResponse<User>>('/auth/me').then(r => r.data),
};

export const leadsApi = {
  getLeads: (filters: LeadFilters) => {
    const p = new URLSearchParams();
    if (filters.status) p.append('status', filters.status);
    if (filters.source) p.append('source', filters.source);
    if (filters.search) p.append('search', filters.search);
    if (filters.sort) p.append('sort', filters.sort);
    if (filters.page) p.append('page', String(filters.page));
    p.append('limit', '10');
    return api.get<ApiResponse<Lead[]>>(`/leads?${p.toString()}`).then(r => r.data);
  },
  getLeadById: (id: string) =>
    api.get<ApiResponse<Lead>>(`/leads/${id}`).then(r => r.data),
  createLead: (data: CreateLeadDto) =>
    api.post<ApiResponse<Lead>>('/leads', data).then(r => r.data),
  updateLead: (id: string, data: UpdateLeadDto) =>
    api.put<ApiResponse<Lead>>(`/leads/${id}`, data).then(r => r.data),
  deleteLead: (id: string) =>
    api.delete<ApiResponse<null>>(`/leads/${id}`).then(r => r.data),
  exportCSV: (filters: Omit<LeadFilters, 'page'>) => {
    const p = new URLSearchParams();
    if (filters.status) p.append('status', filters.status);
    if (filters.source) p.append('source', filters.source);
    if (filters.search) p.append('search', filters.search);
    return api.get(`/leads/export/csv?${p.toString()}`, { responseType: 'blob' }).then(r => r.data);
  },
};
