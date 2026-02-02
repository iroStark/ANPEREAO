import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface Publication {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  fileUrl?: string;
  downloadUrl?: string;
  publishedAt?: string;
  updatedAt?: string;
}

export interface CreatePublicationData {
  title: string;
  description: string;
  category: string;
  date: string;
  fileUrl?: string;
  downloadUrl?: string;
}

export interface UpdatePublicationData extends Partial<CreatePublicationData> {
  id: string;
}

// Fetch all publications
export const usePublications = () => {
  return useQuery<Publication[]>({
    queryKey: ['publications'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/publications');
      return response.json();
    },
  });
};

// Create publication
export const useCreatePublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreatePublicationData) => {
      const response = await apiRequest('POST', '/api/admin/publications', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
    },
  });
};

// Update publication
export const useUpdatePublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdatePublicationData) => {
      const response = await apiRequest('PUT', `/api/admin/publications/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
    },
  });
};

// Delete publication
export const useDeletePublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/admin/publications/${id}`);
      if (response.status === 204) return null;
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
    },
  });
};
