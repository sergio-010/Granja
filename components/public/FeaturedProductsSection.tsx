import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/currency';

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
}

interface FeaturedProductsSectionProps {
    products: Product[];
}

export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
    if (products.length === 0) return null;

    return (
        <section className="py-12 lg:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 lg:mb-12 gap-4">
                    <div>
                        <h3 className="text-2xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            Servicios Destacados
                        </h3>
                        <p className="text-sm lg:text-base text-muted-foreground">
                            Lo mejor para el cuidado de tu mascota
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        asChild
                        className="border-2 border-green-600 hover:bg-green-50 dark:hover:bg-green-950/50 text-sm lg:text-base"
                    >
                        <Link href="/productos">Ver Todo →</Link>
                    </Button>
                </div>
                <div className="grid gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <Card
                            key={product.id}
                            className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-green-500"
                        >
                            <div className="relative w-full h-56">
                                <Image
                                    src={product.imageUrl || `https://placehold.co/600x400/10b981/ffffff?text=${encodeURIComponent(product.name)}`}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded-t-lg"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority={false}
                                />
                            </div>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-2">
                                    <CardTitle className="text-xl">{product.name}</CardTitle>
                                    <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                        {formatCurrency(product.price)}
                                    </div>
                                </div>
                                <CardDescription className="line-clamp-2">
                                    {product.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    asChild
                                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                >
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
    );
}
