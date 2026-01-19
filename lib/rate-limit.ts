/**
 * Rate Limiter simple basado en IP
 * Limita el número de requests por IP en un período de tiempo
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

interface RateLimitOptions {
  interval: number; // en milisegundos
  maxRequests: number;
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  interval: 60 * 1000, // 1 minuto
  maxRequests: 10,
};

/**
 * Limpia entradas expiradas del mapa periódicamente
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

// Limpieza cada 5 minutos
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

/**
 * Verifica si una IP ha excedido el rate limit
 * @param identifier - Identificador único (generalmente IP)
 * @param options - Opciones de rate limiting
 * @returns true si está permitido, false si excedió el límite
 */
export function checkRateLimit(
  identifier: string,
  options: Partial<RateLimitOptions> = {},
): { allowed: boolean; remaining: number; resetAt: number } {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const now = Date.now();

  const entry = rateLimitMap.get(identifier);

  // Si no existe o ya expiró, crear nueva entrada
  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.interval;
    rateLimitMap.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt };
  }

  // Si aún está dentro del límite
  if (entry.count < config.maxRequests) {
    entry.count++;
    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  }

  // Excedió el límite
  return { allowed: false, remaining: 0, resetAt: entry.resetAt };
}

/**
 * Obtiene la IP del cliente desde headers
 */
export function getClientIP(headers: Headers): string {
  // Verifica varios headers comunes de proxies
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIP = headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback a un valor por defecto
  return "unknown";
}

/**
 * Middleware helper para rate limiting en API routes
 */
export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  options?: Partial<RateLimitOptions>,
) {
  return async (request: Request): Promise<Response> => {
    const ip = getClientIP(request.headers);
    const { allowed, remaining, resetAt } = checkRateLimit(ip, options);

    if (!allowed) {
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          message: "Por favor, espera un momento antes de intentar de nuevo",
          resetAt: new Date(resetAt).toISOString(),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(Math.ceil((resetAt - Date.now()) / 1000)),
            "X-RateLimit-Limit": String(
              options?.maxRequests || DEFAULT_OPTIONS.maxRequests,
            ),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(resetAt),
          },
        },
      );
    }

    const response = await handler(request);

    // Agregar headers de rate limit a la respuesta
    response.headers.set(
      "X-RateLimit-Limit",
      String(options?.maxRequests || DEFAULT_OPTIONS.maxRequests),
    );
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    response.headers.set("X-RateLimit-Reset", String(resetAt));

    return response;
  };
}
