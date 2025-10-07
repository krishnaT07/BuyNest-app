import { useState, useEffect } from "react";
import { api, ApiError } from "@/lib/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { immediate = true, onSuccess, onError } = options;

  const execute = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await api.get<T>(endpoint);
      setState({ data: response.data, loading: false, error: null });
      onSuccess?.(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : "An error occurred";
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      onError?.(error as ApiError);
      throw error;
    }
  };

  const mutate = async (method: "POST" | "PUT" | "PATCH" | "DELETE", data?: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let response;
      switch (method) {
        case "POST":
          response = await api.post<T>(endpoint, data);
          break;
        case "PUT":
          response = await api.put<T>(endpoint, data);
          break;
        case "PATCH":
          response = await api.patch<T>(endpoint, data);
          break;
        case "DELETE":
          response = await api.delete<T>(endpoint);
          break;
      }
      
      setState({ data: response.data, loading: false, error: null });
      onSuccess?.(response.data);
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof ApiError ? error.message : "An error occurred";
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      onError?.(error as ApiError);
      throw error;
    }
  };

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [endpoint, immediate]);

  return {
    ...state,
    execute,
    mutate,
    refresh: execute,
  };
}