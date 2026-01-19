import { Metadata } from 'next';
import { SITE_CONFIG } from './constants';

/**
 * Metadata por defecto del sitio
 */
export const defaultMetadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'veterinaria',
    'mascotas',
    'cuidado animal',
    'servicios veterinarios',
    'consulta veterinaria',
    'emergencias veterinarias',
  ],
  authors: [{ name: SITE_CONFIG.name }],
  creator: SITE_CONFIG.name,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: '/',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

/**
 * Genera metadata para páginas de producto
 */
export function generateProductMetadata(product: {
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
}): Metadata {
  const title = `${product.name} - Servicios`;
  const description = product.description || `${product.name} disponible en ${SITE_CONFIG.name}`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: product.imageUrl ? [{ url: product.imageUrl, alt: product.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

/**
 * Genera metadata para páginas del admin
 */
export function generateAdminMetadata(title: string, description?: string): Metadata {
  return {
    title: `${title} - Admin`,
    description: description || `Panel de administración - ${title}`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

/**
 * Genera metadata para páginas de error
 */
export function generateErrorMetadata(errorCode: number): Metadata {
  const titles: Record<number, string> = {
    404: 'Página no encontrada',
    500: 'Error del servidor',
    403: 'Acceso denegado',
  };
  
  return {
    title: titles[errorCode] || 'Error',
    robots: {
      index: false,
      follow: false,
    },
  };
}

/**
 * Genera JSON-LD para SEO estructurado
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'VeterinaryCare',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    telephone: `+${SITE_CONFIG.contact.whatsapp}`,
    email: SITE_CONFIG.contact.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE_CONFIG.contact.address,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
  };
}

/**
 * Genera JSON-LD para productos/servicios
 */
export function generateProductSchema(product: {
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'BOB',
      availability: 'https://schema.org/InStock',
    },
  };
}
