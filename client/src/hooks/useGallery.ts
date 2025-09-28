import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
      const response = await fetch('/api/gallery');
      if (!response.ok) {
        throw new Error('Failed to fetch gallery items');
      }
      return response.json();
    },
  });
};

// Create gallery item
export const useCreateGalleryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateGalleryItemData) => {
      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create gallery item');
      }
      
      return response.json();
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
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update gallery item');
      }
      
      return response.json();
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
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete gallery item');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
    },
  });
};
