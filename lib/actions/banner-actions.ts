'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const bannerSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  subtitle: z.string().optional(),
  imageUrl: z.string().url('URL inválida'),
  buttonText: z.string().optional(),
  linkUrl: z.string().optional(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
  startsAt: z.date().optional(),
  endsAt: z.date().optional(),
});

export async function getBanners() {
  return await prisma.banner.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getBanner(id: string) {
  return await prisma.banner.findUnique({
    where: { id },
  });
}

export async function createBanner(data: z.infer<typeof bannerSchema>) {
  const validated = bannerSchema.parse(data);

  const banner = await prisma.banner.create({
    data: validated,
  });

  revalidatePath('/admin/banners');
  revalidatePath('/');
  return banner;
}

export async function updateBanner(id: string, data: z.infer<typeof bannerSchema>) {
  const validated = bannerSchema.parse(data);

  const banner = await prisma.banner.update({
    where: { id },
    data: validated,
  });

  revalidatePath('/admin/banners');
  revalidatePath('/');
  return banner;
}

export async function deleteBanner(id: string) {
  await prisma.banner.delete({
    where: { id },
  });

  revalidatePath('/admin/banners');
  revalidatePath('/');
}

export async function getActiveBanners() {
  const now = new Date();
  
  return await prisma.banner.findMany({
    where: {
      isActive: true,
      OR: [
        { startsAt: null, endsAt: null },
        { startsAt: { lte: now }, endsAt: null },
        { startsAt: null, endsAt: { gte: now } },
        { startsAt: { lte: now }, endsAt: { gte: now } },
      ],
    },
    orderBy: { order: 'asc' },
  });
}
