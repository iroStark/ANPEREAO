import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Helper to determine base URL
function getBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  // If envUrl is defined, use it. Otherwise, default to empty string (relative paths)
  return envUrl ? envUrl.replace(/\/api\/?$/, "") : "";
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  let finalUrl = url;

  if (baseUrl && url.startsWith("/api")) {
    const cleanBase = baseUrl.replace(/\/api\/?$/, "");
    finalUrl = `${cleanBase}${url}`;
  }

  const headers: Record<string, string> = {
    "Accept": "application/json",
    ...(data ? { "Content-Type": "application/json" } : {})
  };

  const res = await fetch(finalUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/");
    const baseUrl = import.meta.env.VITE_API_URL || "";
    let finalUrl = url.startsWith("/") ? url : `/${url}`;

    if (baseUrl && finalUrl.startsWith("/api")) {
      const cleanBase = baseUrl.replace(/\/api\/?$/, "");
      finalUrl = `${cleanBase}${finalUrl}`;
    }

    const res = await fetch(finalUrl, {
      headers: {
        'Accept': 'application/json',
      },
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
