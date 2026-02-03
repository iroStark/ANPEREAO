import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'editor' | 'viewer';
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  updatedAt?: string;
}

export interface CreateUserData {
  username: string;
  email?: string;
  password: string;
  role: 'admin' | 'editor' | 'viewer';
  isActive?: boolean;
}

export interface UpdateUserData {
  id: string;
  username?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'editor' | 'viewer';
  isActive?: boolean;
}

// Fetch all users
export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/users');
      return res.json();
    },
  });
};

// Create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const res = await apiRequest('POST', '/api/admin/users', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateUserData) => {
      const res = await apiRequest('PUT', `/api/admin/users/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/admin/users/${id}`);
      if (res.status === 204) return null;
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
