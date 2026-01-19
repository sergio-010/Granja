import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

interface CTASectionProps {
  whatsappNumber?: string;
}

export function CTASection({ whatsappNumber = '123456789' }: CTASectionProps) {
  return (
    <section className="relative py-24 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
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
          <Button 
            size="lg" 
            variant="secondary" 
            asChild 
            className="bg-white text-green-700 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-200"
          >
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
              <Phone className="mr-2 h-5 w-5" />
              📞 Contactar Ahora
            </a>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            asChild 
            className="border-2 border-white text-white hover:bg-white/20 shadow-lg"
          >
            <Link href="/productos">🏥 Ver Servicios</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
