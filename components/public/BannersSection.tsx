import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  buttonText: string | null;
  linkUrl: string | null;
}

interface BannersSectionProps {
  banners: Banner[];
}

export function BannersSection({ banners }: BannersSectionProps) {
  if (banners.length === 0) return null;

  return (
    <section className="py-12 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 lg:mb-12">
          <h3 className="text-2xl lg:text-4xl font-bold mb-2 lg:mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            🎉 Promociones Especiales
          </h3>
          <p className="text-muted-foreground text-base lg:text-lg">
            Aprovecha nuestras ofertas exclusivas
          </p>
        </div>
        <div className="grid gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <Card 
              key={banner.id} 
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-green-500"
            >
              <div className="relative w-full h-56">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={false}
                />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{banner.title}</CardTitle>
                {banner.subtitle && (
                  <CardDescription className="text-base">{banner.subtitle}</CardDescription>
                )}
              </CardHeader>
              {banner.buttonText && banner.linkUrl && (
                <CardContent>
                  <Button 
                    asChild 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
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
  );
}
