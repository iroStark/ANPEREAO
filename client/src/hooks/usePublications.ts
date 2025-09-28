import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
      const response = await fetch('/api/publications');
      if (!response.ok) {
        throw new Error('Failed to fetch publications');
      }
      return response.json();
    },
  });
};

// Create publication
export const useCreatePublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreatePublicationData) => {
      const response = await fetch('/api/admin/publications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create publication');
      }
      
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
      const response = await fetch(`/api/admin/publications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update publication');
      }
      
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
      const response = await fetch(`/api/admin/publications/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete publication');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
    },
  });
};
