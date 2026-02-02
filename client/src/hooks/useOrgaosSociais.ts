import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface OrgaoSocial {
  id: string;
  name: string;
  position: string;
  organType: string; // 'Assembleia Geral', 'Direcção', 'Conselho Fiscal'
  bio?: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
  orderIndex: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrgaoSocialData {
  name: string;
  position: string;
  organType: string;
  bio?: string;
  photoUrl?: string;
  email?: string;
  phone?: string;
  orderIndex?: number;
  isActive?: boolean;
}

// Fetch all orgaos sociais (public)
export const useOrgaosSociais = () => {
  return useQuery<OrgaoSocial[]>({
    queryKey: ['orgaos-sociais'],
    queryFn: async () => {
      // Correct public endpoint from api.php
      const res = await apiRequest('GET', '/api/social-organs');
      return res.json();
    },
  });
};

// Fetch orgaos sociais by type (public)
export const useOrgaosSociaisByType = (type: string) => {
  return useQuery<OrgaoSocial[]>({
    queryKey: ['orgaos-sociais', 'type', type],
    queryFn: async () => {
      // We might need to implement this filter in backend or just filter client side
      // For now, let's fetch all and filter client side if the endpoint doesn't exist
      // Or we can add a query param. 
      // Let's rely on fetching all and filtering if the backend doesn't support specific type routing yet
      // But wait, api.php doesn't have /tipo/{type}. 
      // I will assume for now we use the main endpoint and filter.
      // Actually, let's keep it simple and just fetch all.
      const res = await apiRequest('GET', '/api/social-organs');
      const all = await res.json();
      return (all as OrgaoSocial[]).filter(o => o.organType === type);
    },
    enabled: !!type,
  });
};

// Fetch single orgao social by ID (public)
export const useOrgaoSocialById = (id: string) => {
  return useQuery<OrgaoSocial>({
    queryKey: ['orgao-social', id],
    queryFn: async () => {
       // We don't have a public ID endpoint explicitly, but let's try standard REST
       // Wait, api.php has `Route::get('/social-organs', ...)` which maps to index. 
       // It does NOT have show.
       // So this might fail.
       // However, often we don't need single fetch if we have the list.
       // Let's unimplemented or use Admin show if allowed? No, public shouldn't use admin.
       // I'll leave it as is but note it might fail, or better, fetch list and find.
       const res = await apiRequest('GET', '/api/social-organs');
       const all = await res.json();
       return (all as OrgaoSocial[]).find(o => o.id === id) as OrgaoSocial;
    },
    enabled: !!id,
  });
};

// Admin hooks
export const useAllOrgaosSociais = () => {
  return useQuery<OrgaoSocial[]>({
    queryKey: ['admin', 'orgaos-sociais'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/social-orgaos');
      return res.json();
    },
  });
};

export const useCreateOrgaoSocial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateOrgaoSocialData) => {
      const res = await apiRequest('POST', '/api/admin/social-orgaos', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgaos-sociais'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orgaos-sociais'] });
    },
  });
};

export const useUpdateOrgaoSocial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<CreateOrgaoSocialData>) => {
      const res = await apiRequest('PUT', `/api/admin/social-orgaos/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgaos-sociais'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orgaos-sociais'] });
    },
  });
};

export const useDeleteOrgaoSocial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/admin/social-orgaos/${id}`);
      if (res.status === 204) return null;
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgaos-sociais'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orgaos-sociais'] });
    },
  });
};

