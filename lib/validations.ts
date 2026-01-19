import { z } from "zod";

/**
 * Schemas de validación reutilizables
 */

// Validación de ID
export const idSchema = z.string().min(1, "ID requerido").cuid("ID inválido");

// Validación de email
export const emailSchema = z
  .string()
  .email("Email inválido")
  .toLowerCase()
  .trim();

// Validación de contraseña
export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(100, "La contraseña es demasiado larga")
  .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
  .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
  .regex(/[0-9]/, "Debe contener al menos un número");

// Validación de nombre
export const nameSchema = z
  .string()
  .min(1, "El nombre es requerido")
  .max(100, "El nombre es demasiado largo")
  .trim();

// Validación de descripción
export const descriptionSchema = z
  .string()
  .max(1000, "La descripción es demasiado larga")
  .optional();

// Validación de precio
export const priceSchema = z
  .number()
  .positive("El precio debe ser positivo")
  .finite("El precio debe ser un número válido")
  .max(9999999.99, "El precio es demasiado alto");

// Validación de URL
export const urlSchema = z
  .string()
  .url("URL inválida")
  .optional()
  .or(z.literal(""));

// Validación de slug
export const slugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug inválido (solo letras minúsculas, números y guiones)",
  );

// Validación de teléfono
export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Número de teléfono inválido")
  .optional();

// Validación de fecha
export const dateSchema = z.coerce.date();

// Validación de porcentaje
export const percentageSchema = z
  .number()
  .min(0, "El porcentaje no puede ser negativo")
  .max(100, "El porcentaje no puede ser mayor a 100");

/**
 * Schema para paginación
 */
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(10),
});

/**
 * Schema para ordenamiento
 */
export const sortSchema = z.object({
  field: z.string(),
  order: z.enum(["asc", "desc"]).default("asc"),
});

/**
 * Schema para búsqueda
 */
export const searchSchema = z.object({
  query: z.string().max(100).optional(),
  filters: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
});

/**
 * Tipo de respuesta estándar para acciones del servidor
 */
export type ActionResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Helper para crear respuestas de acción exitosas
 */
export function successResponse<T>(data: T): ActionResponse<T> {
  return { success: true, data };
}

/**
 * Helper para crear respuestas de acción con error
 */
export function errorResponse(error: string): ActionResponse<never> {
  return { success: false, error };
}

/**
 * Wrapper para acciones del servidor con manejo de errores
 */
export function withErrorHandling<
  T extends (...args: never[]) => Promise<R>,
  R = unknown,
>(fn: T): (...args: Parameters<T>) => Promise<ActionResponse<R>> {
  return async (...args: Parameters<T>) => {
    try {
      const result = (await fn(...args)) as R;
      return successResponse(result);
    } catch (error) {
      console.error("Action error:", error);

      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        return errorResponse(firstError.message);
      }

      if (error instanceof Error) {
        return errorResponse(error.message);
      }

      return errorResponse("Ocurrió un error inesperado");
    }
  };
}
