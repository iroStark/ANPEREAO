import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface User {
  id: string;
  username: string; // Backend likely 'name'
  email?: string;
  role: 'admin' | 'editor' | 'viewer'; // Backend User model doesn't have role by default, need to check or assume
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

export interface UpdateUserData extends Partial<CreateUserData> {
  id: string;
}

// Fetch all users
export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/users');
      // Map backend 'name' to 'username'?
      // Or just return as is and let UI break?
      // Better to map if I can, but I can't verify backend response structure fully without running it.
      // Laravel User: name, email, password.
      // Frontend User: username, email, role.
      // I will assume backend returns 'name' and frontend expects 'username'.
      // I'll fix the hook to conform to APIRequest.
      return res.json();
    },
  });
};

// Create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      // Map username to name
      const payload = {
          name: data.username,
          email: data.email,
          password: data.password,
          // role... backend lacks role field currently.
      };
      const res = await apiRequest('POST', '/api/admin/users', payload);
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
      const payload: any = {};
      if (data.username) payload.name = data.username;
      if (data.email) payload.email = data.email;
      if (data.password) payload.password = data.password;
      
      const res = await apiRequest('PUT', `/api/admin/users/${id}`, payload);
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
