'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseAsyncOptions<T = unknown> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

/**
 * Hook para manejar operaciones asíncronas con estados de loading y error
 */
export function useAsync<T = unknown>(
  asyncFunction: (...args: unknown[]) => Promise<T>,
  options: UseAsyncOptions<T> = {}
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: unknown[]) => {
      setState({ data: null, isLoading: true, error: null });

      try {
        const data = await asyncFunction(...args);
        setState({ data, isLoading: false, error: null });

        if (options.showSuccessToast) {
          toast.success(options.successMessage || 'Operación exitosa');
        }

        options.onSuccess?.(data);
        return data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Error desconocido');
        setState({ data: null, isLoading: false, error: err });

        if (options.showErrorToast !== false) {
          toast.error(err.message || 'Ocurrió un error');
        }

        options.onError?.(err);
        throw err;
      }
    },
    [asyncFunction, options]
  );

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
