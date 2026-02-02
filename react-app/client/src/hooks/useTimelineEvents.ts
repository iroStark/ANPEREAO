import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getAuthHeaders = () => ({
  ...(localStorage.getItem('auth_token') ? { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } : {})
});

export interface TimelineEvent {
  id: string;
  year: string;
  event: string;
  description: string;
  details?: string;
  imageUrl?: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTimelineEventData {
  year: string;
  event: string;
  description: string;
  details?: string;
  imageUrl?: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateTimelineEventData extends Partial<CreateTimelineEventData> {
  id: string;
}

// Hook to fetch all timeline events (Public)
export const useTimelineEvents = () => {
  return useQuery<TimelineEvent[]>({
    queryKey: ['timeline-events'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/timeline-events`);
      if (!response.ok) {
        throw new Error('Failed to fetch timeline events');
      }
      return response.json();
    },
  });
};

// Hook to fetch all timeline events (Admin - includes inactive)
export const useTimelineEventsAdmin = () => {
  return useQuery<TimelineEvent[]>({
    queryKey: ['timeline-events-admin'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/timeline-events`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch timeline events');
      }
      return response.json();
    },
  });
};

// Hook to fetch a single timeline event
export const useTimelineEvent = (id: string) => {
  return useQuery<TimelineEvent>({
    queryKey: ['timeline-event', id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/admin/timeline-events/${id}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch timeline event');
      }
      return response.json();
    },
    enabled: !!id,
  });
};

// Hook to create a timeline event
export const useCreateTimelineEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateTimelineEventData | FormData) => {
      const response = await fetch(`${API_BASE_URL}/admin/timeline-events`, {
        method: 'POST',
        credentials: 'include',
        body: data instanceof FormData ? data : JSON.stringify(data),
        headers: data instanceof FormData 
          ? getAuthHeaders() 
          : { 'Content-Type': 'application/json', ...getAuthHeaders() },
      });
      if (!response.ok) {
        throw new Error('Failed to create timeline event');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline-events'] });
      queryClient.invalidateQueries({ queryKey: ['timeline-events-admin'] });
    },
  });
};

// Hook to update a timeline event
export const useUpdateTimelineEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateTimelineEventData | { id: string; data: FormData }) => {
      const isFormData = 'data' in input && input.data instanceof FormData;
      const body = isFormData ? input.data : JSON.stringify(input);
      const headers = isFormData 
        ? getAuthHeaders() 
        : { 'Content-Type': 'application/json', ...getAuthHeaders() };
      const eventId = input.id;

      const response = await fetch(`${API_BASE_URL}/admin/timeline-events/${eventId}`, {
        method: 'PUT',
        credentials: 'include',
        body,
        headers,
      });
      if (!response.ok) {
        throw new Error('Failed to update timeline event');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline-events'] });
      queryClient.invalidateQueries({ queryKey: ['timeline-events-admin'] });
    },
  });
};

// Hook to delete a timeline event
export const useDeleteTimelineEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/admin/timeline-events/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Failed to delete timeline event');
      }
      if (response.status === 204) return null;
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline-events'] });
      queryClient.invalidateQueries({ queryKey: ['timeline-events-admin'] });
    },
  });
};
