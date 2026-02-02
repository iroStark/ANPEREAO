import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface Report {
  id: string; // Backend sends ID
  title: string;
  description: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'special';
  status: 'draft' | 'published' | 'archived';
  period: string;
  fileUrl?: string; // Mapped from file_url in backend if we consistently map it
  // Wait, I didn't add accessors for camelCase in Report.php for type, status, period etc.
  // Actually I did for fileUrl. 
  // Everything else is same snake/camel? 
  // type -> type
  // status -> status
  // period -> period
  // title -> title
  // description -> description
  // created_at -> createdAt (need accessor or frontend map)
  // updated_at -> updatedAt
  createdAt: string;
  updatedAt?: string;
}

export interface CreateReportData {
  title: string;
  description: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'special';
  status: 'draft' | 'published' | 'archived';
  period: string;
  fileUrl?: string;
}

export interface UpdateReportData extends Partial<CreateReportData> {
  id: string;
}

// Fetch all reports (public - only published)
export const useReports = () => {
  return useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: async () => {
      // Public endpoint
      const res = await apiRequest('GET', '/api/reports');
      return res.json();
    },
  });
};

// Fetch all reports (admin - all statuses)
export const useReportsAdmin = () => {
  return useQuery<Report[]>({
    queryKey: ['admin', 'reports'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/reports');
      return res.json();
    },
  });
};

// Create report
export const useCreateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateReportData) => {
      const res = await apiRequest('POST', '/api/admin/reports', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });
};

// Update report
export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateReportData) => {
      const res = await apiRequest('PUT', `/api/admin/reports/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });
};

// Delete report
export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/admin/reports/${id}`);
      if (res.status === 204) return null;
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });
};
