'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingCart,
  DollarSign,
  TrendingDown,
  Package,
  Image as ImageIcon,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { signOut } from 'next-auth/react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pos', label: 'POS', icon: ShoppingCart },
  { href: '/admin/ventas', label: 'Ventas', icon: DollarSign },
  { href: '/admin/gastos', label: 'Gastos', icon: TrendingDown },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white dark:bg-gray-900 shadow-xl">
        <div className="p-6 border-b bg-gradient-to-r from-green-600 to-emerald-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-2xl">
              🐾
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">La Granja de Pipe</h1>
              <p className="text-xs text-green-100">Panel de Administración</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400'
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "animate-pulse")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-11 border-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 border-b bg-white dark:bg-gray-900 shadow-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="hidden md:block w-2 h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Sistema de Gestión Veterinaria
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-red-50 hover:text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
