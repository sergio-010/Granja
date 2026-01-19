import { getActiveBanners } from '@/lib/actions/banner-actions';
import { getFeaturedProducts } from '@/lib/actions/product-actions';
import { PublicHeader } from '@/components/public/PublicHeader';
import { HeroSection } from '@/components/public/HeroSection';
import { BannersSection } from '@/components/public/BannersSection';
import { FeaturesSection } from '@/components/public/FeaturesSection';
import { FeaturedProductsSection } from '@/components/public/FeaturedProductsSection';
import { CTASection } from '@/components/public/CTASection';
import { PublicFooter } from '@/components/public/PublicFooter';
import { SITE_CONFIG } from '@/lib/constants';
import { generateOrganizationSchema } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inicio',
  description: `${SITE_CONFIG.description}. Servicios integrales para el bienestar de tu mascota.`,
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const banners = await getActiveBanners();
  const featuredProducts = await getFeaturedProducts();
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      {/* JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="min-h-screen bg-background">
        <PublicHeader />

        <main>
          <HeroSection whatsappNumber={SITE_CONFIG.contact.whatsapp} />
          <BannersSection banners={banners} />
          <FeaturesSection />
          <FeaturedProductsSection products={featuredProducts} />
          <CTASection whatsappNumber={SITE_CONFIG.contact.whatsapp} />
        </main>

        <PublicFooter
          whatsappNumber={SITE_CONFIG.contact.whatsapp}
          email={SITE_CONFIG.contact.email}
          address={SITE_CONFIG.contact.address}
        />
      </div>
    </>
  );
}
