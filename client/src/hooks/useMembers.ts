import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

// Hook para buscar todos os membros
export const useMembers = () => {
  return useQuery<Member[]>({
    queryKey: ['members'],
    queryFn: async () => {
      const response = await fetch('/api/admin/members', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Erro ao buscar membros');
      }
      
      return response.json();
    },
  });
};

// Hook para buscar um membro específico
export const useMember = (id: string) => {
  return useQuery<Member>({
    queryKey: ['member', id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/members/${id}`, {
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Erro ao buscar membro');
      }
      
      return response.json();
    },
    enabled: !!id,
  });
};

// Hook para atualizar status do membro
export const useUpdateMemberStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'inactive' | 'pending' }) => {
      const response = await fetch(`/api/admin/members/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao atualizar status do membro');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};

// Hook para deletar membro
export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/admin/members/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Erro ao deletar membro');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
  });
};
