# 🚀 Deployment en Vercel - La Granja de Pipe

Este proyecto está optimizado para deployment en Vercel.

## 📋 Pre-requisitos

1. Cuenta en [Vercel](https://vercel.com)
2. Cuenta en GitHub (opcional pero recomendado)
3. Base de datos PostgreSQL (recomendado para producción)

## 🗄️ Base de Datos para Producción

**SQLite NO funciona en Vercel** porque el sistema de archivos es de solo lectura.

### Opciones recomendadas:

#### 1. **Vercel Postgres** (Recomendado - Más fácil)

```bash
# Instalar desde Vercel Dashboard
# Storage → Create Database → Postgres
# Las variables de entorno se configuran automáticamente
```

#### 2. **Neon** (Gratis, Serverless Postgres)

- Web: https://neon.tech
- Gratis hasta 0.5GB
- Setup rápido

#### 3. **Supabase** (Postgres + Auth + Storage)

- Web: https://supabase.com
- Incluye database, auth, storage
- Generoso plan gratuito

#### 4. **PlanetScale** (MySQL serverless)

- Web: https://planetscale.com
- MySQL compatible
- Buena capa gratuita

## 🔧 Pasos para Deployment

### 1. Preparar el Proyecto

```bash
# Instala Vercel CLI (opcional)
npm i -g vercel

# Verifica que el build funcione
npm run build
```

### 2. Actualizar Prisma Schema

Edita `prisma/schema.prisma` y cambia el datasource:

```prisma
datasource db {
  provider = "postgresql"  // Cambiar de sqlite a postgresql
  url      = env("DATABASE_URL")
}
```

### 3. Configurar Variables de Entorno en Vercel

Ve a tu proyecto en Vercel Dashboard → Settings → Environment Variables:

```env
# Database (ejemplo con Vercel Postgres)
DATABASE_URL=postgres://usuario:password@host:5432/database

# NextAuth - IMPORTANTE: Genera un secret seguro
NEXTAUTH_SECRET=genera_con_openssl_rand_base64_32
NEXTAUTH_URL=https://tu-dominio.vercel.app

# URLs públicas
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
NEXT_PUBLIC_WHATSAPP=123456789
NEXT_PUBLIC_EMAIL=info@tuempresa.com
NEXT_PUBLIC_ADDRESS=Tu dirección
```

**Generar NEXTAUTH_SECRET seguro:**

```bash
openssl rand -base64 32
```

### 4. Deploy a Vercel

#### Opción A: Desde GitHub (Recomendado)

1. Sube tu código a GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

2. Conecta en Vercel:
   - Ve a https://vercel.com/new
   - Importa tu repositorio de GitHub
   - Configura las variables de entorno
   - Deploy automático

#### Opción B: Con Vercel CLI

```bash
# Login
vercel login

# Deploy (primera vez)
vercel

# Deploy a producción
vercel --prod
```

### 5. Configurar Base de Datos

```bash
# Genera el cliente de Prisma
npx prisma generate

# Ejecuta migraciones en producción
npx prisma migrate deploy

# Seed inicial (opcional)
npx prisma db seed
```

**IMPORTANTE:** Ejecuta estos comandos en Vercel usando:

- Vercel Dashboard → Settings → Functions → Command Override
- O crea un script `postbuild` en package.json

### 6. Script Post-Build

Agrega a `package.json`:

```json
{
  "scripts": {
    "postbuild": "npx prisma generate && npx prisma migrate deploy"
  }
}
```

## 🔐 Seguridad

✅ **Configurado:**

- Rate limiting implementado
- Validaciones en servidor
- Autenticación con NextAuth
- Error boundaries
- CSRF protection

⚠️ **Por hacer en producción:**

1. Cambiar `NEXTAUTH_SECRET` a uno seguro
2. Configurar dominio personalizado
3. Habilitar HTTPS (automático en Vercel)
4. Revisar políticas CORS si usas API externa

## 📊 Monitoreo

Vercel provee automáticamente:

- Analytics de performance
- Logs en tiempo real
- Error tracking
- Web Vitals

## 🔄 Actualizaciones

Con GitHub conectado:

```bash
git add .
git commit -m "Tu cambio"
git push
```

Vercel deployará automáticamente.

## 🆘 Troubleshooting

### Error: "Module not found"

```bash
npm install
npm run build
```

### Error: "Database connection failed"

- Verifica que DATABASE_URL esté correctamente configurado
- Asegúrate que la DB acepte conexiones externas
- Revisa que usaste PostgreSQL en lugar de SQLite

### Error: "NEXTAUTH_URL mismatch"

- Actualiza NEXTAUTH_URL con tu dominio de Vercel
- Reinicia el deployment

### Prisma no genera tablas

```bash
# En local, crea y aplica migración
npx prisma migrate dev --name init

# Luego en Vercel, las migraciones se aplican con postbuild
```

## 📚 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma en Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [NextAuth Deployment](https://next-auth.js.org/deployment)

## 🎉 ¡Listo!

Tu app estará disponible en: `https://tu-proyecto.vercel.app`

### Dominios personalizados

Ve a Vercel Dashboard → Settings → Domains para agregar tu dominio.
