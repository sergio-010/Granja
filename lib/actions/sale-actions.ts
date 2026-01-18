"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { DateRange } from "@/lib/dateRange";

const saleItemSchema = z.object({
  productId: z.string().nullable(),
  nameSnapshot: z.string().min(1),
  unitPriceSnapshot: z.number().positive(),
  quantity: z.number().int().positive(),
  subtotal: z.number().positive(),
});

const saleSchema = z.object({
  date: z.date().optional(),
  subtotal: z.number().positive(),
  discountPercent: z.number().min(0).max(100).default(0),
  total: z.number().positive(),
  paymentMethod: z.enum(["CASH", "TRANSFER", "CARD", "OTHER"]),
  customerName: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(saleItemSchema).min(1, "Debe agregar al menos un item"),
});

export async function createSale(
  data: z.infer<typeof saleSchema>,
  userId?: string,
) {
  const validated = saleSchema.parse(data);

  // Si no se proporciona userId, intentar obtener el primer admin
  let finalUserId = userId;
  if (!finalUserId) {
    const adminUser = await prisma.user.findFirst({
      where: { role: "SUPER_ADMIN" },
    });
    if (!adminUser) {
      throw new Error("No se encontró un usuario administrador");
    }
    finalUserId = adminUser.id;
  }

  const sale = await prisma.sale.create({
    data: {
      date: validated.date || new Date(),
      subtotal: validated.subtotal,
      discountPercent: validated.discountPercent,
      total: validated.total,
      paymentMethod: validated.paymentMethod,
      customerName: validated.customerName,
      notes: validated.notes,
      createdById: finalUserId,
      items: {
        create: validated.items,
      },
    },
    include: {
      items: true,
    },
  });

  revalidatePath("/admin/ventas");
  revalidatePath("/admin/dashboard");
  return sale;
}

export async function getSales(dateRange?: DateRange) {
  const where = dateRange
    ? {
        date: {
          gte: dateRange.from,
          lte: dateRange.to,
        },
      }
    : {};

  return await prisma.sale.findMany({
    where,
    include: {
      items: {
        include: {
          product: true,
        },
      },
      createdBy: {
        select: {
          email: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });
}

export async function getSale(id: string) {
  return await prisma.sale.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      createdBy: {
        select: {
          email: true,
        },
      },
    },
  });
}

export async function deleteSale(id: string) {
  await prisma.sale.delete({
    where: { id },
  });

  revalidatePath("/admin/ventas");
  revalidatePath("/admin/dashboard");
}

export async function getSalesStats(dateRange: DateRange) {
  const sales = await prisma.sale.findMany({
    where: {
      date: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
    },
    select: {
      total: true,
      paymentMethod: true,
    },
  });

  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
  const salesCount = sales.length;
  const avgTicket = salesCount > 0 ? totalSales / salesCount : 0;

  const byPaymentMethod = sales.reduce(
    (acc, sale) => {
      const method = sale.paymentMethod;
      acc[method] = (acc[method] || 0) + Number(sale.total);
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    totalSales,
    salesCount,
    avgTicket,
    byPaymentMethod,
  };
}

export async function getSalesByDay(dateRange: DateRange) {
  const sales = await prisma.sale.findMany({
    where: {
      date: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
    },
    select: {
      date: true,
      total: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  const byDay = sales.reduce(
    (acc, sale) => {
      const dateKey = sale.date.toISOString().split("T")[0];
      acc[dateKey] = (acc[dateKey] || 0) + Number(sale.total);
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(byDay).map(([date, total]) => ({
    date,
    total,
  }));
}
