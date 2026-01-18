'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { generateUniqueSlug } from '@/lib/slug';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  price: z.number().positive('El precio debe ser positivo'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  type: z.enum(['PRODUCT', 'SERVICE']),
});

export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProduct(id: string) {
  return await prisma.product.findUnique({
    where: { id },
  });
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
  });
}

export async function createProduct(data: z.infer<typeof productSchema>) {
  const validated = productSchema.parse(data);

  const slug = await generateUniqueSlug(validated.name, async (slug) => {
    const existing = await prisma.product.findUnique({ where: { slug } });
    return !!existing;
  });

  const product = await prisma.product.create({
    data: {
      ...validated,
      slug,
      imageUrl: validated.imageUrl || `https://placehold.co/600x400/e5e7eb/64748b?text=${encodeURIComponent(validated.name)}`,
    },
  });

  revalidatePath('/admin/productos');
  revalidatePath('/productos');
  return product;
}

export async function updateProduct(id: string, data: z.infer<typeof productSchema>) {
  const validated = productSchema.parse(data);

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) throw new Error('Producto no encontrado');

  let slug = existing.slug;

  // Regenerar slug si el nombre cambió
  if (validated.name !== existing.name) {
    slug = await generateUniqueSlug(validated.name, async (newSlug) => {
      if (newSlug === existing.slug) return false;
      const found = await prisma.product.findUnique({ where: { slug: newSlug } });
      return !!found;
    });
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...validated,
      slug,
      imageUrl: validated.imageUrl || existing.imageUrl,
    },
  });

  revalidatePath('/admin/productos');
  revalidatePath('/productos');
  revalidatePath(`/productos/${slug}`);
  return product;
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  });

  revalidatePath('/admin/productos');
  revalidatePath('/productos');
}

export async function getActiveProducts() {
  return await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function getFeaturedProducts() {
  return await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });
}
