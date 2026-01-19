"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

/**
 * Hook para manejar acciones del servidor con transiciones
 */
export function useServerAction<
  T extends (...args: never[]) => Promise<unknown>,
>(
  action: T,
  options?: {
    onSuccess?: (data: Awaited<ReturnType<T>>) => void;
    onError?: (error: Error) => void;
    successMessage?: string;
    errorMessage?: string;
  },
) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const execute = async (...args: Parameters<T>) => {
    startTransition(async () => {
      try {
        const result = await action(...args);

        if (
          result &&
          typeof result === "object" &&
          "success" in result &&
          !result.success
        ) {
          const errorResult = result as { success: false; error?: string };
          throw new Error(
            errorResult.error ||
              options?.errorMessage ||
              "Error en la operación",
          );
        }

        if (options?.successMessage) {
          toast.success(options.successMessage);
        }

        options?.onSuccess?.(result as Awaited<ReturnType<T>>);
        router.refresh();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : options?.errorMessage || "Error inesperado";
        toast.error(message);
        options?.onError?.(error instanceof Error ? error : new Error(message));
      }
    });
  };

  return {
    execute,
    isPending,
  };
}
