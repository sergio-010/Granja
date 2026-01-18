'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { DateRange } from '@/lib/dateRange';

const expenseSchema = z.object({
  date: z.date().optional(),
  amount: z.number().positive(),
  category: z.string().min(1, 'La categoría es requerida'),
  paymentMethod: z.enum(['CASH', 'TRANSFER', 'CARD', 'OTHER']).optional(),
  notes: z.string().optional(),
});

export async function createExpense(
  data: z.infer<typeof expenseSchema>,
  userId: string
) {
  const validated = expenseSchema.parse(data);

  const expense = await prisma.expense.create({
    data: {
      date: validated.date || new Date(),
      amount: validated.amount,
      category: validated.category,
      paymentMethod: validated.paymentMethod,
      notes: validated.notes,
      createdById: userId,
    },
    include: {
      createdBy: {
        select: {
          email: true,
        },
      },
    },
  });

  revalidatePath('/admin/gastos');
  revalidatePath('/admin/dashboard');
  return expense;
}

export async function getExpenses(dateRange?: DateRange) {
  const where = dateRange
    ? {
        date: {
          gte: dateRange.from,
          lte: dateRange.to,
        },
      }
    : {};

  return await prisma.expense.findMany({
    where,
    include: {
      createdBy: {
        select: {
          email: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  });
}

export async function getExpense(id: string) {
  return await prisma.expense.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          email: true,
        },
      },
    },
  });
}

export async function updateExpense(
  id: string,
  data: z.infer<typeof expenseSchema>,
  userId: string
) {
  const validated = expenseSchema.parse(data);

  const expense = await prisma.expense.update({
    where: { id },
    data: {
      date: validated.date,
      amount: validated.amount,
      category: validated.category,
      paymentMethod: validated.paymentMethod,
      notes: validated.notes,
    },
  });

  revalidatePath('/admin/gastos');
  revalidatePath('/admin/dashboard');
  return expense;
}

export async function deleteExpense(id: string) {
  await prisma.expense.delete({
    where: { id },
  });

  revalidatePath('/admin/gastos');
  revalidatePath('/admin/dashboard');
}

export async function getExpensesStats(dateRange: DateRange) {
  const expenses = await prisma.expense.findMany({
    where: {
      date: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
    },
    select: {
      amount: true,
      category: true,
    },
  });

  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const expensesCount = expenses.length;

  const byCategory = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + Number(exp.amount);
    return acc;
  }, {} as Record<string, number>);

  return {
    totalExpenses,
    expensesCount,
    byCategory,
  };
}

export async function getExpensesByDay(dateRange: DateRange) {
  const expenses = await prisma.expense.findMany({
    where: {
      date: {
        gte: dateRange.from,
        lte: dateRange.to,
      },
    },
    select: {
      date: true,
      amount: true,
    },
    orderBy: {
      date: 'asc',
    },
  });

  const byDay = expenses.reduce((acc, expense) => {
    const dateKey = expense.date.toISOString().split('T')[0];
    acc[dateKey] = (acc[dateKey] || 0) + Number(expense.amount);
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(byDay).map(([date, amount]) => ({
    date,
    amount,
  }));
}
