import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'special';
  status: 'draft' | 'published' | 'archived';
  period: string;
  fileUrl?: string;
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

// Fetch all reports
export const useReports = () => {
  return useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: async () => {
      const response = await fetch('/api/admin/reports', {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }
      return response.json();
    },
  });
};

// Create report
export const useCreateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateReportData) => {
      const response = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create report');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

// Update report
export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateReportData) => {
      const response = await fetch(`/api/admin/reports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update report');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};

// Delete report
export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/reports/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete report');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
