import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export function PublicHeader() {
  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3 lg:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg lg:text-xl">
            🐾
          </div>
          <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            La Granja de Pipe
          </h1>
        </div>
        <div className="flex items-center gap-2 lg:gap-4">
          <nav className="hidden md:flex gap-4 lg:gap-6">
            <Link href="/" className="text-sm lg:text-base hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link href="/productos" className="text-sm lg:text-base hover:text-primary transition-colors">
              Servicios
            </Link>
            <Link href="/productos" className="text-sm lg:text-base hover:text-primary transition-colors">
              Productos
            </Link>
          </nav>
          <ThemeToggle />
          <Button asChild size="sm" className="text-xs lg:text-sm">
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
