import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Clock, Shield, LucideIcon } from 'lucide-react';

interface Feature {
    icon: LucideIcon;
    title: string;
    description: string;
    colorFrom: string;
    colorTo: string;
}

const features: Feature[] = [
    {
        icon: Heart,
        title: 'Atención con Amor',
        description: 'Tratamos a cada mascota como si fuera nuestra, con cuidado y dedicación absoluta.',
        colorFrom: 'from-red-500',
        colorTo: 'to-pink-500',
    },
    {
        icon: Clock,
        title: 'Horarios Flexibles',
        description: 'Disponibles para atender a tu mascota cuando más lo necesites.',
        colorFrom: 'from-blue-500',
        colorTo: 'to-cyan-500',
    },
    {
        icon: Shield,
        title: 'Profesionales',
        description: 'Equipo de veterinarios certificados con más de 15 años de experiencia',
        colorFrom: 'from-green-500',
        colorTo: 'to-emerald-500',
    },
];

export function FeaturesSection() {
    return (
        <section className="py-12 lg:py-24 bg-gradient-to-b from-background to-green-50/30 dark:to-green-950/10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10 lg:mb-16">
                    <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 lg:mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ¿Por qué La Granja de Pipe?
                    </h3>
                    <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Compromiso total con la salud y felicidad de tu mascota
                    </p>
                </div>
                <div className="grid gap-6 lg:gap-8 md:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={feature.title}
                                className="border-2 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                            >
                                <CardHeader>
                                    <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${feature.colorFrom} ${feature.colorTo} flex items-center justify-center mb-4`}>
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
