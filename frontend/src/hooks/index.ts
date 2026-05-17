import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { leadsApi } from '../api/services';
import { LeadFilters, CreateLeadDto, UpdateLeadDto } from '../types';

export function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debouncedValue;
}

export function useLeads(filters: LeadFilters) {
  return useQuery({ queryKey: ['leads', filters], queryFn: () => leadsApi.getLeads(filters), placeholderData: (p) => p });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLeadDto) => leadsApi.createLead(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leads'] }); toast.success('Lead added'); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to create lead'),
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadDto }) => leadsApi.updateLead(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leads'] }); toast.success('Lead updated'); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to update'),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leads'] }); toast.success('Lead removed'); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to delete'),
  });
}

export function useExportCSV() {
  const exportCSV = useCallback(async (filters: Omit<LeadFilters, 'page'>) => {
    try {
      const blob = await leadsApi.exportCSV(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported');
    } catch { toast.error('Export failed'); }
  }, []);
  return { exportCSV };
}
