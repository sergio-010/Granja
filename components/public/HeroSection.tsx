import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

interface HeroSectionProps {
    whatsappNumber?: string;
}

export function HeroSection({ whatsappNumber = '123456789' }: HeroSectionProps) {
    return (
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
                    <Button
                        size="lg"
                        asChild
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm lg:text-base"
                    >
                        <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                            <Phone className="mr-2 h-5 w-5" />
                            📞 Contactar WhatsApp
                        </a>
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        asChild
                        className="border-2 border-green-600 text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/50 shadow-md"
                    >
                        <Link href="/productos">🏥 Ver Servicios</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
