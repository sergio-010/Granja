import { auth } from './index';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

export async function requireAuth() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/admin/login');
  }
  
  return session;
}

export async function requireRole(allowedRoles: Role[]) {
  const session = await requireAuth();
  
  const userRole = session.user.role;
  
  if (!allowedRoles.includes(userRole)) {
    redirect('/admin/dashboard');
  }
  
  return session;
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}
