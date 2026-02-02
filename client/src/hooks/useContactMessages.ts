import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean; // Backend: 'read' boolean
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateContactMessageData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Fetch all contact messages (admin)
export const useContactMessages = () => {
  return useQuery<ContactMessage[]>({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/contact-messages");
      return res.json();
    },
    retry: false,
  });
};

// Fetch single contact message (admin)
export const useContactMessage = (id: string) => {
  return useQuery<ContactMessage>({
    queryKey: ["contact-messages", id],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/admin/contact-messages/${id}`);
      return res.json();
    },
    enabled: !!id,
  });
};

// Update contact message (admin)
export const useUpdateContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<ContactMessage>) => {
      const payload: any = {};
      if (typeof data.isRead !== 'undefined') payload.read = data.isRead; // Map isRead -> read

      const res = await apiRequest("PUT", `/api/admin/contact-messages/${id}`, payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
    },
  });
};

// Delete contact message (admin)
export const useDeleteContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/admin/contact-messages/${id}`);
      if (res.status === 204) return null;
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
    },
  });
};
