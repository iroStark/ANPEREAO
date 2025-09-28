import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Legislation {
  id: string;
  title: string;
  description: string;
  category: string;
  year: string;
  icon: string;
  publishedAt?: string;
  updatedAt?: string;
}

export interface CreateLegislationData {
  title: string;
  description: string;
  category: string;
  year: string;
  icon: string;
}

export interface UpdateLegislationData extends Partial<CreateLegislationData> {
  id: string;
}

// Fetch all legislation
export const useLegislation = () => {
  return useQuery<Legislation[]>({
    queryKey: ['legislation'],
    queryFn: async () => {
      const response = await fetch('/api/legislation');
      if (!response.ok) {
        throw new Error('Failed to fetch legislation');
      }
      return response.json();
    },
  });
};

// Create legislation
export const useCreateLegislation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateLegislationData) => {
      const response = await fetch('/api/legislation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create legislation');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legislation'] });
    },
  });
};

// Update legislation
export const useUpdateLegislation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateLegislationData) => {
      const response = await fetch(`/api/legislation/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update legislation');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legislation'] });
    },
  });
};

// Delete legislation
export const useDeleteLegislation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/legislation/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete legislation');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legislation'] });
    },
  });
};
