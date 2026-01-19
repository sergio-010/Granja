import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getActiveBanners } from '@/lib/actions/banner-actions';
import { getFeaturedProducts } from '@/lib/actions/product-actions';
import { ThemeToggle } from '@/components/theme-toggle';
import { Heart, Clock, Shield, Phone } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const banners = await getActiveBanners();
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg lg:text-xl">
              🐾
            </div>
            <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">La Granja de Pipe</h1>
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

      <main>
        {/* Hero Section */}
        <section className="relative py-12 lg:py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-800 overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
          <div className="container mx-auto px-4 text-center relative">
            <div className="inline-block mb-4 px-3 lg:px-4 py-1.5 lg:py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300 text-xs lg:text-sm font-semibold">
              ✨ Cuidado Profesional para tus Mascotas
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 lg:mb-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              La Granja de Pipe
            </h2>
            <p className="text-xl md:text-2xl lg:text-3xl font-semibold mb-3 lg:mb-4 text-gray-700 dark:text-gray-200">
              Donde tu Mascota es Familia 🐾
            </p>
            <p className="text-base lg:text-lg text-muted-foreground mb-8 lg:mb-10 max-w-3xl mx-auto leading-relaxed">
              Atención veterinaria profesional con amor, dedicación y más de 15 años de experiencia.
              Servicios integrales para el bienestar de tu compañero.
            </p>
            <div className="flex gap-3 lg:gap-4 justify-center flex-wrap">
              <Button size="lg" asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm lg:text-base">
                <a href="https://wa.me/123456789" target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 h-5 w-5" />
                  📞 Contactar WhatsApp
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-2 border-green-600 text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/50 shadow-md">
                <Link href="/productos">🏥 Ver Servicios</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Banners Section */}
        {banners.length > 0 && (
          <section className="py-12 lg:py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8 lg:mb-12">
                <h3 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">🎉 Promociones Especiales</h3>
                <p className="text-muted-foreground text-base lg:text-lg">Aprovecha nuestras ofertas exclusivas</p>
              </div>
              <div className="grid gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {banners.map((banner) => (
                  <Card key={banner.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-green-500">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-56 object-cover"
                    />
                    <CardHeader>
                      <CardTitle className="text-2xl">{banner.title}</CardTitle>
                      {banner.subtitle && (
                        <CardDescription className="text-base">{banner.subtitle}</CardDescription>
                      )}
                    </CardHeader>
                    {banner.buttonText && banner.linkUrl && (
                      <CardContent>
                        <Button asChild className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                          <a
                            href={banner.linkUrl}
                            target={banner.linkUrl.startsWith('http') ? '_blank' : '_self'}
                            rel="noopener noreferrer"
                          >
                            {banner.buttonText} →
                          </a>
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="py-12 lg:py-24 bg-gradient-to-b from-background to-green-50/30 dark:to-green-950/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 lg:mb-16">
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 lg:mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">¿Por qué La Granja de Pipe?</h3>
              <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">Compromiso total con la salud y felicidad de tu mascota</p>
            </div>
            <div className="grid gap-6 lg:gap-8 md:grid-cols-3">
              <Card className="border-2 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Atención con Amor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Tratamos a cada mascota como si fuera nuestra, con cuidado y dedicación absoluta.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Horarios Flexibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Disponibles para atender a tu mascota cuando más lo necesites.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Profesionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Equipo de veterinarios certificados con más de 15 años de experiencia
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Products/Services */}
        {featuredProducts.length > 0 && (
          <section className="py-12 lg:py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 lg:mb-12 gap-4">
                <div>
                  <h3 className="text-2xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Servicios Destacados</h3>
                  <p className="text-sm lg:text-base text-muted-foreground">Lo mejor para el cuidado de tu mascota</p>
                </div>
                <Button variant="outline" asChild className="border-2 border-green-600 hover:bg-green-50 dark:hover:bg-green-950/50 text-sm lg:text-base">
                  <Link href="/productos">Ver Todo →</Link>
                </Button>
              </div>
              <div className="grid gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-green-500">
                    <img
                      src={product.imageUrl || `https://placehold.co/600x400/10b981/ffffff?text=${encodeURIComponent(product.name)}`}
                      alt={product.name}
                      className="w-full h-56 object-cover rounded-t-lg"
                    />
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl">{product.name}</CardTitle>
                        <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {formatCurrency(product.price)}
                        </div>
                      </div>
                      <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        <Link href={`/productos/${product.slug}`}>
                          Ver Detalles 🐾
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="relative py-24 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30\"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
              🌟 Tu Mascota nos Importa
            </div>
            <h3 className="text-5xl md:text-6xl font-extrabold mb-6">
              ¿Listo para Cuidar a tu Mascota?
            </h3>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
              Contáctanos hoy y agenda una cita. En <strong>La Granja de Pipe</strong> estamos listos para ayudarte.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" variant="secondary" asChild className="bg-white text-green-700 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-200">
                <a href="https://wa.me/123456789" target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 h-5 w-5" />
                  📞 Contactar Ahora
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-2 border-white text-white hover:bg-white/20 shadow-lg">
                <Link href="/productos">
                  🏥 Ver Servicios
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 lg:py-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:gap-8 md:grid-cols-3 mb-6 lg:mb-8">
            <div>
              <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
                <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-xl lg:text-2xl">
                  🐾
                </div>
                <h3 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">La Granja de Pipe</h3>
              </div>
              <p className="text-sm lg:text-base text-gray-400">
                Cuidado veterinario profesional con más de 15 años de experiencia. Tu mascota es nuestra familia.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3 lg:mb-4 text-base lg:text-lg">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm lg:text-base text-gray-400">
                <li><Link href="/" className="hover:text-green-400 transition-colors">Inicio</Link></li>
                <li><Link href="/productos" className="hover:text-green-400 transition-colors">Servicios</Link></li>
                <li><Link href="/productos" className="hover:text-green-400 transition-colors">Productos</Link></li>
                <li><Link href="/login" className="hover:text-green-400 transition-colors">Iniciar Sesión</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3 lg:mb-4 text-base lg:text-lg">Contacto</h4>
              <ul className="space-y-2 text-sm lg:text-base text-gray-400">
                <li>📞 WhatsApp: <a href="https://wa.me/123456789" className="hover:text-green-400 transition-colors">+123 456 789</a></li>
                <li>📧 Email: info@lagranjade pipe.com</li>
                <li>📍 Dirección: Tu ciudad</li>
                <li>🕒 Horario: 24/7 Emergencias</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4 lg:pt-6 text-center text-sm lg:text-base text-gray-400">
            <p>© 2026 <strong className="text-green-400">La Granja de Pipe</strong>. Todos los derechos reservados. Hecho con 💚 para tus mascotas.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
