import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface Member {
  id: string;
  memberNumber: string;
  fullName: string;
  birthDate: string;
  birthPlace: string;
  nationality: string;
  gender: 'Masculino' | 'Feminino';
  maritalStatus: 'Solteiro(a)' | 'Casado(a)' | 'Divorciado(a)' | 'Viúvo(a)';
  idDocument: string;
  idIssueDate: string;
  idIssuePlace: string;
  fatherName: string;
  motherName: string;
  occupation: string;
  phone: string;
  currentAddress: string;
  municipality: string;
  workProvince: string;
  email: string;
  photoUrl?: string;
  otherInfo?: string;
  registrationDate: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

// Hook for Admin to fetch all members
export const useMembers = () => {
  return useQuery<Member[]>({
    queryKey: ['members'],
    queryFn: async () => {
      // Use Admin endpoint
      const res = await apiRequest('GET', '/api/admin/members');
      return res.json();
    },
  });
};

/* 
// Note: If public members list is needed, we would use:
export const usePublicMembers = () => {
  return useQuery<Member[]>({
    queryKey: ['public-members'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/members');
      return res.json();
    },
  });
};
*/

// Hook to fetch single member (Admin)
export const useMember = (id: string) => {
  return useQuery<Member>({
    queryKey: ['member', id],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/admin/members/${id}`);
      return res.json();
    },
    enabled: !!id,
  });
};

// Hook to update member status (Admin)
export const useUpdateMemberStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'inactive' | 'pending' }) => {
      const res = await apiRequest('PUT', `/api/admin/members/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

// Hook to delete member (Admin)
export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/admin/members/${id}`);
      if (res.status === 204) return null;
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};
