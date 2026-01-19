/**
 * Constantes de configuración del sitio
 */
export const SITE_CONFIG = {
  name: "La Granja de Pipe",
  description:
    "Cuidado veterinario profesional con más de 15 años de experiencia",
  contact: {
    whatsapp: "123456789",
    email: "info@lagranjadevpipe.com",
    address: "Tu ciudad",
  },
  social: {
    whatsappUrl: (number: string) => `https://wa.me/${number}`,
  },
} as const;

/**
 * URLs de navegación
 */
export const ROUTES = {
  home: "/",
  products: "/productos",
  login: "/login",
  admin: {
    dashboard: "/admin/dashboard",
    login: "/admin/login",
    products: "/admin/productos",
    sales: "/admin/ventas",
    expenses: "/admin/gastos",
    banners: "/admin/banners",
    pos: "/admin/pos",
  },
} as const;

/**
 * Constantes de la UI
 */
export const UI_CONFIG = {
  defaultProductImage: (text: string) =>
    `https://placehold.co/600x400/10b981/ffffff?text=${encodeURIComponent(text)}`,
  colors: {
    primary: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
  },
} as const;

/**
 * Límites y configuraciones de paginación
 */
export const PAGINATION = {
  defaultPageSize: 10,
  maxPageSize: 100,
} as const;

/**
 * Mensajes de error comunes
 */
export const ERROR_MESSAGES = {
  generic: "Ocurrió un error inesperado",
  unauthorized: "No tienes permisos para realizar esta acción",
  notFound: "El recurso solicitado no existe",
  validation: "Por favor verifica los datos ingresados",
  network: "Error de conexión, intenta de nuevo",
} as const;
