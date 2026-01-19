import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

/**
 * Verifica que el usuario esté autenticado
 * @returns Session del usuario autenticado
 * @throws Redirige a login si no está autenticado
 */
export async function requireAuth() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/admin/login');
  }
  
  return session;
}

/**
 * Verifica que el usuario tenga el rol requerido
 * @param role Rol requerido
 * @returns Session del usuario autenticado
 * @throws Error si no tiene el rol requerido
 */
export async function requireRole(role: 'ADMIN' | 'SUPER_ADMIN') {
  const session = await requireAuth();
  
  if (session.user.role !== role && session.user.role !== 'SUPER_ADMIN') {
    throw new Error('No tienes permisos para realizar esta acción');
  }
  
  return session;
}

/**
 * Obtiene el usuario actual o lanza error si no está autenticado
 */
export async function getCurrentUser() {
  const session = await requireAuth();
  return session.user;
}
