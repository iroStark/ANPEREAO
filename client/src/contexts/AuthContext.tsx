import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const queryClient = useQueryClient();

  // Check if user is authenticated - use getQueryFn with returnNull on 401
  const { data: authData, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn<{ user: User }>({ on401: "returnNull" }),
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update user state when auth data changes
  useEffect(() => {
    if (authData && authData.user) {
      setUser(authData.user);
      setIsCheckingAuth(false);
    } else if (authData === null || error) {
      // null means 401 (not authenticated), which is expected
      setUser(null);
      setIsCheckingAuth(false);
    }
  }, [authData, error]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      if (data && data.user) {
        setUser(data.user);
        // Save token to localStorage for persistent auth
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
        }
        // Update the query cache with the user data directly
        // Don't invalidate to avoid extra requests
        queryClient.setQueryData(["/api/auth/me"], { user: data.user });
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
      setUser(null);
      queryClient.setQueryData(["/api/auth/me"], null);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      setUser(null);
      localStorage.removeItem('auth_token');
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.clear(); // Clear all cached data on logout
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Still clear user state even if logout request fails
      setUser(null);
      queryClient.setQueryData(["/api/auth/me"], null);
    },
  });

  const login = async (credentials: { username: string; password: string }) => {
    await loginMutation.mutateAsync(credentials);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading: isLoading || isCheckingAuth,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}