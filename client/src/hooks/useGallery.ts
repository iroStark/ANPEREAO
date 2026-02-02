import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video';
  date: string;
  category: string;
  views?: number;
  duration?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  publishedAt?: string;
  updatedAt?: string;
}

export interface CreateGalleryItemData {
  title: string;
  description: string;
  type: 'image' | 'video';
  date: string;
  category: string;
  views?: number;
  duration?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
}

export interface UpdateGalleryItemData extends Partial<CreateGalleryItemData> {
  id: string;
}

// Fetch all gallery items
export const useGallery = () => {
  return useQuery<GalleryItem[]>({
    queryKey: ['gallery'],
    queryFn: async () => {
      // Use public endpoint
      const res = await apiRequest('GET', '/api/gallery');
      return res.json();
    },
  });
};

// Create gallery item
export const useCreateGalleryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateGalleryItemData) => {
      const res = await apiRequest('POST', '/api/admin/gallery', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });
};

// Update gallery item
export const useUpdateGalleryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateGalleryItemData) => {
      const res = await apiRequest('PUT', `/api/admin/gallery/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });
};

// Delete gallery item
export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/admin/gallery/${id}`);
      if (res.status === 204) return null;
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });
};
