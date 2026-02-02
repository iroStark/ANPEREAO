import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  capacity?: string;
  registrationUrl?: string;
  publishedAt?: string;
  updatedAt?: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: string;
  capacity?: string;
  registrationUrl?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string;
}

// Fetch all events
export const useEvents = () => {
  return useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      // Public view
      const res = await apiRequest('GET', '/api/events');
      return res.json();
    },
  });
};

// Fetch all events (admin) - reused or separate? 
// Usually admin view might need inactive ones if we added that flag. 
export const useEventsAdmin = () => {
  return useQuery<Event[]>({
    queryKey: ['admin', 'events'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/events');
      return res.json();
    },
  });
};

// Create event
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateEventData) => {
      const res = await apiRequest('POST', '/api/admin/events', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] });
    },
  });
};

// Update event
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateEventData) => {
      const res = await apiRequest('PUT', `/api/admin/events/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] });
    },
  });
};

// Delete event
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/admin/events/${id}`);
      if (res.status === 204) return null;
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'events'] });
    },
  });
};
