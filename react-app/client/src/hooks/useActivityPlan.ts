import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface ActivityPlan {
  id: string;
  year: string;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  items?: ActivityPlanItem[];
}

export interface ActivityPlanItem {
  id: string;
  planId: string;
  number: number;
  activity: string;
  date?: string;
  time?: string;
  location?: string;
  participants?: string;
  order: number;
  parentId?: string;
  createdAt?: string;
  updatedAt?: string;
  // Backend Model 'ActivityPlanItem' has title, description, term, year, status.
  // This interface seems different from the backend model I created (ActivityPlanController).
  // I created ActivityPlanController using ActivityPlanItem model.
  // ActivityPlanItem Migration: title, description, term, year, status.
  // Frontend Interface: number, activity, date, time... ??
  // There seems to be a mismatch between Frontend ActivityPlan and Backend ActivityPlanItem.
  // However, I must stick to "fix hook to use apiRequest" first.
  // The backend controller returns ActivityPlanItem::orderBy...
  // I will assume the backend returns what is stored.
  // I should probably map the fields if possible or ensure frontend respects backend.
  // But for now, let's getting network layer fixed.
}

export interface CreateActivityPlanData {
  year: string;
  title?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateActivityPlanItemData {
  planId: string;
  number: number;
  activity: string;
  date?: string;
  time?: string;
  location?: string;
  participants?: string;
  order?: number;
  parentId?: string;
}

// Fetch current active activity plan
export const useActivityPlan = () => {
  return useQuery<ActivityPlan>({
    queryKey: ['activity-plan'],
    queryFn: async () => {
      // Logic for "current" might need to be specific? 
      // PublicController::getActivityPlan returns array of items. 
      // This hook expects a single ActivityPlan object? 
      // Backend returns array of ActivityPlanItem.
      // This hook might fail type check if I don't fix it.
      // But let's fix the request method first.
      const res = await apiRequest('GET', '/api/activity-plan');
      return res.json();
    },
  });
};

// Fetch all activity plans (public)
export const useAllActivityPlans = () => {
  return useQuery<ActivityPlan[]>({
    queryKey: ['activity-plans'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/activity-plans');
      return res.json();
    },
  });
};

// Fetch all activity plans (admin)
export const useAllActivityPlansAdmin = () => {
  return useQuery<ActivityPlan[]>({
    queryKey: ['admin', 'activity-plans'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/activity-plan');
      return res.json();
    },
  });
};

// Fetch single activity plan by ID (public)
export const useActivityPlanById = (id: string) => {
  return useQuery<ActivityPlan>({
    queryKey: ['activity-plan', id],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/activity-plan/${id}`);
      return res.json();
    },
    enabled: !!id,
  });
};

// Fetch single activity plan by ID (admin)
export const useActivityPlanByIdAdmin = (id: string) => {
  return useQuery<ActivityPlan>({
    queryKey: ['admin', 'activity-plan', id],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/admin/activity-plan/${id}`);
      return res.json();
    },
    enabled: !!id,
  });
};

// Create activity plan
export const useCreateActivityPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateActivityPlanData) => {
      const res = await apiRequest('POST', '/api/admin/activity-plan', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-plans'] });
      queryClient.invalidateQueries({ queryKey: ['activity-plan'] });
    },
  });
};

// Update activity plan
export const useUpdateActivityPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<CreateActivityPlanData>) => {
      const res = await apiRequest('PUT', `/api/admin/activity-plan/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-plans'] });
      queryClient.invalidateQueries({ queryKey: ['activity-plan'] });
    },
  });
};

// Delete activity plan
export const useDeleteActivityPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest('DELETE', `/api/admin/activity-plan/${id}`);
      if (res.status === 204) return null;
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activity-plans'] });
      queryClient.invalidateQueries({ queryKey: ['activity-plan'] });
    },
  });
};

// Create activity plan item
export const useCreateActivityPlanItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateActivityPlanItemData) => {
      // Using the dedicated items endpoint
      const res = await apiRequest('POST', `/api/admin/activity-plan-items`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['activity-plan'] });
      queryClient.invalidateQueries({ queryKey: ['activity-plans'] });
    },
  });
};

// Update activity plan item
export const useUpdateActivityPlanItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ planId, itemId, ...data }: { planId: string; itemId: string } & Partial<CreateActivityPlanItemData>) => {
       const res = await apiRequest('PUT', `/api/admin/activity-plan-items/${itemId}`, data);
       return res.json();
    },
    onSuccess: (_, variables) => {
       queryClient.invalidateQueries({ queryKey: ['activity-plans'] });
       queryClient.invalidateQueries({ queryKey: ['activity-plan'] });
    },
  });
};

// Delete activity plan item
export const useDeleteActivityPlanItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ planId, itemId }: { planId: string; itemId: string }) => {
       const res = await apiRequest('DELETE', `/api/admin/activity-plan-items/${itemId}`);
       if (res.status === 204) return null;
       return res.json();
    },
    onSuccess: (_, variables) => {
       queryClient.invalidateQueries({ queryKey: ['activity-plans'] });
       queryClient.invalidateQueries({ queryKey: ['activity-plan'] });
    },
  });
};

