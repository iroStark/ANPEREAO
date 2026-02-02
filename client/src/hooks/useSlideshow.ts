import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface SlideshowItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSlideshowData {
  title: string;
  subtitle?: string;
  description: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

// Fetch all slideshow items (admin)
export const useSlideshow = () => {
  return useQuery({
    queryKey: ["slideshow"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/slideshow");
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    retry: false,
  });
};

// Fetch public slideshow items (only active slides, sorted by order)
export const usePublicSlideshow = () => {
  return useQuery({
    queryKey: ["public-slideshow"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/slideshow");
        const slides = await response.json() as SlideshowItem[];
        
        if (!Array.isArray(slides)) {
          console.warn("Invalid slideshow response, using fallback");
          return [];
        }
        
        return slides
          .filter(slide => slide.isActive)
          // Sort by order_index (backend) or order (frontend interface)
          // The interface says 'order', backend usually sends 'order_index'
          // We'll trust the interface or default to 0
          .sort((a, b) => (a.order || 0) - (b.order || 0));
      } catch (error) {
        console.warn("Failed to fetch public slideshow:", error);
        return [];
      }
    },
    retry: false,
  });
};

// Create slideshow item
export const useCreateSlideshow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSlideshowData) => {
      const response = await apiRequest("POST", "/api/admin/slideshow", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slideshow"] });
      queryClient.invalidateQueries({ queryKey: ["public-slideshow"] });
    },
  });
};

// Update slideshow item
export const useUpdateSlideshow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<CreateSlideshowData>) => {
      const response = await apiRequest("PUT", `/api/admin/slideshow/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slideshow"] });
      queryClient.invalidateQueries({ queryKey: ["public-slideshow"] });
    },
  });
};

// Delete slideshow item
export const useDeleteSlideshow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/slideshow/${id}`);
      if (response.status === 204) return null;
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["slideshow"] });
      queryClient.invalidateQueries({ queryKey: ["public-slideshow"] });
    },
  });
};

