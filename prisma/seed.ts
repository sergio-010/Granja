import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Crear SUPER_ADMIN
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  try {
    await prisma.user.upsert({
      where: { email: 'admin@veterinaria.com' },
      update: {},
      create: {
        email: 'admin@veterinaria.com',
        passwordHash: adminPassword,
        role: 'SUPER_ADMIN',
      },
    });
    console.log('✅ SUPER_ADMIN created: admin@veterinaria.com');
  } catch (e) {
    console.log('⚠️  Error creating admin@veterinaria.com', e);
  }

  // Crear segundo ADMIN
  const admin2Password = await bcrypt.hash('Admin010', 10);
  
  try {
    await prisma.user.upsert({
      where: { email: 'admin@gmail.com' },
      update: {},
      create: {
        email: 'admin@gmail.com',
        passwordHash: admin2Password,
        role: 'ADMIN',
      },
    });
    console.log('✅ ADMIN created: admin@gmail.com');
  } catch (e) {
    console.log('⚠️  Error creating admin@gmail.com', e);
  }

  // Crear productos/servicios de ejemplo
  const products = [
    {
      name: 'Consulta Veterinaria',
      slug: 'consulta-veterinaria',
      description: 'Consulta general con veterinario',
      price: 250.00,
      type: 'SERVICE',
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Vacuna Triple Felina',
      slug: 'vacuna-triple-felina',
      description: 'Vacuna para gatos contra panleucopenia, calicivirus y rinotraqueítis',
      price: 350.00,
      type: 'SERVICE',
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Vacuna Antirrábica',
      slug: 'vacuna-antirrabica',
      description: 'Vacuna antirrábica para perros y gatos',
      price: 200.00,
      type: 'SERVICE',
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Desparasitación',
      slug: 'desparasitacion',
      description: 'Desparasitación interna',
      price: 150.00,
      type: 'SERVICE',
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Alimento Premium Perro 15kg',
      slug: 'alimento-premium-perro-15kg',
      description: 'Alimento balanceado premium para perros adultos',
      price: 850.00,
      type: 'PRODUCT',
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Alimento Premium Gato 7.5kg',
      slug: 'alimento-premium-gato-75kg',
      description: 'Alimento balanceado premium para gatos adultos',
      price: 650.00,
      type: 'PRODUCT',
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Collar Antipulgas',
      slug: 'collar-antipulgas',
      description: 'Collar antipulgas y garrapatas',
      price: 180.00,
      type: 'PRODUCT',
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Baño y Corte',
      slug: 'bano-y-corte',
      description: 'Servicio de estética completo',
      price: 400.00,
      type: 'SERVICE',
      isActive: true,
      isFeatured: true,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log(`✅ ${products.length} productos/servicios creados`);

  // Crear banners de ejemplo
  const banners = [
    {
      title: '¡Bienvenidos a Nuestra Veterinaria!',
      subtitle: 'Cuidamos de tu mascota como si fuera nuestra',
      imageUrl: 'https://placehold.co/1200x400/006BA6/FFF?text=Banner+1',
      buttonText: 'Ver Servicios',
      linkUrl: '/productos',
      order: 1,
      isActive: true,
    },
    {
      title: 'Promoción Vacunación',
      subtitle: '20% de descuento en vacunas este mes',
      imageUrl: 'https://placehold.co/1200x400/00A878/FFF?text=Banner+2',
      buttonText: 'Reservar Cita',
      linkUrl: 'https://wa.me/123456789',
      order: 2,
      isActive: true,
    },
    {
      title: 'Tienda de Alimentos',
      subtitle: 'Las mejores marcas para tu mascota',
      imageUrl: 'https://placehold.co/1200x400/FFB627/000?text=Banner+3',
      buttonText: 'Ver Catálogo',
      linkUrl: '/productos',
      order: 3,
      isActive: true,
    },
  ];

  for (const banner of banners) {
    await prisma.banner.create({
      data: banner,
    });
  }

  console.log(`✅ ${banners.length} banners creados`);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
