import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface Legislation {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  icon: string;
  content?: string;
  fileUrl?: string; // Mapped from file_url in backend
  publishedAt?: string;
  updatedAt?: string;
}

export interface CreateLegislationData {
  title: string;
  description: string;
  category: string;
  year: string;
  icon: string;
  content?: string;
  fileUrl?: string;
}

export interface UpdateLegislationData extends Partial<CreateLegislationData> {
  id: string;
}

// Fetch all legislation (Public endpoint)
export const useLegislation = () => {
  return useQuery<Legislation[]>({
    queryKey: ['legislation'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/legislation');
      return response.json();
    },
  });
};

// Fetch single legislation by ID (Public endpoint)
export const useLegislationById = (id: string) => {
  return useQuery<Legislation>({
    queryKey: ['legislation', id],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/legislation/${id}`);
      return response.json();
    },
    enabled: !!id,
  });
};

// Create legislation (Admin endpoint)
export const useCreateLegislation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateLegislationData) => {
      const response = await apiRequest('POST', '/api/admin/legislation', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legislation'] });
    },
  });
};

// Update legislation (Admin endpoint)
export const useUpdateLegislation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateLegislationData) => {
      const response = await apiRequest('PUT', `/api/admin/legislation/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legislation'] });
    },
  });
};

// Delete legislation (Admin endpoint)
export const useDeleteLegislation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/admin/legislation/${id}`);
      if (response.status === 204) {
        return null;
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legislation'] });
    },
  });
};
