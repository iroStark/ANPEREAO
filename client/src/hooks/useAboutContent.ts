import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface AboutContent {
  id: string;
  section: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InsertAboutContent {
  section: string;
  title: string;
  content: string;
}

// Hook to fetch all about content
export const useAboutContent = () => {
  return useQuery<AboutContent[]>({
    queryKey: ['about-content'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/admin/about');
      return response.json();
    },
  });
};

// Hook to fetch about content by section
export const useAboutContentBySection = (section: string) => {
  return useQuery<AboutContent | undefined>({
    queryKey: ['about-content', section],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/admin/about?section=${section}`);
      const data = await response.json();
      return Array.isArray(data) ? data.find((item: AboutContent) => item.section === section) : data;
    },
    enabled: !!section,
  });
};

// Hook to create about content
export const useCreateAboutContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertAboutContent) => {
      const response = await apiRequest('POST', '/api/admin/about', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-content'] });
    },
  });
};

// Hook to update about content
export const useUpdateAboutContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<InsertAboutContent>) => {
      const response = await apiRequest('PUT', `/api/admin/about/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-content'] });
    },
  });
};

// Hook to delete about content
export const useDeleteAboutContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest('DELETE', `/api/admin/about/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-content'] });
    },
  });
};

