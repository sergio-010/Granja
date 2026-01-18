# 🐾 La Granja de Pipe - Sistema de Gestión Veterinaria

Sistema completo de gestión veterinaria desarrollado con **Next.js 16**, **TypeScript**, **Prisma** y **shadcn/ui**.

![La Granja de Pipe](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma)

## ✨ Características Principales

### 🌐 Área Pública
- ✅ **Landing page moderna** con diseño atractivo y animaciones
- ✅ **Catálogo de servicios** completo y responsive
- ✅ **Banners promocionales** dinámicos
- ✅ **Páginas de detalle** para cada servicio/producto
- ✅ **Modo oscuro/claro** con toggle persistente
- ✅ **Integración WhatsApp** para contacto directo

### 🔐 Área Admin (Protegida)
- ✅ **Autenticación segura** con NextAuth.js v5
- ✅ **Dashboard interactivo** con KPIs en tiempo real
- ✅ **Gráficos avanzados** con Recharts
- ✅ **Sistema POS completo**
- ✅ **Registro de gastos** detallado
- ✅ **CRUD completo** de productos/servicios y banners
- ✅ **Historial y reportes** con filtros avanzados

## 🚀 Tecnologías

- **Next.js 16** (App Router)
- **TypeScript 5.9**
- **Prisma 6** + SQLite
- **NextAuth.js v5**
- **shadcn/ui** + Tailwind CSS
- **Recharts** para visualizaciones
- **Zod** para validaciones

## 📦 Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="tu-secret-key-super-segura"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Configurar la base de datos

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Iniciar el servidor

```bash
npm run dev
```

Visita [http://localhost:3000](http://localhost:3000)

## 🔑 Credenciales de Acceso

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `admin@veterinaria.com` | `admin123` | SUPER_ADMIN |
| `admin@gmail.com` | `Admin010` | ADMIN |

## 📂 Estructura del Proyecto

```
dash/
├── app/
│   ├── (public)/          # Rutas públicas
│   ├── admin/             # Panel admin
│   ├── api/auth/          # NextAuth
│   ├── login/             # Login
│   └── page.tsx           # Landing
├── components/
│   ├── admin/             # Componentes admin
│   └── ui/                # shadcn/ui
├── lib/
│   ├── actions/           # Server Actions
│   └── auth.ts            # Config auth
├── prisma/
│   ├── schema.prisma      # Schema BD
│   └── seed.ts            # Seed datos
└── public/                # Estáticos
```

## 🎨 Diseño

- Gradientes modernos verde/esmeralda
- Animaciones suaves
- Cards con hover effects
- Responsive design
- Dark mode optimizado
- Glassmorphism

## 📊 Dashboard

- KPIs principales
- Gráficos interactivos (Recharts)
- Filtros por periodo
- Ventas vs Gastos
- Distribución por método de pago

## 🔧 Scripts

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm start            # Servidor producción
npx prisma studio    # Prisma Studio GUI
```

## 🌟 Sistema POS

- Búsqueda rápida
- Carrito interactivo
- Múltiples métodos de pago
- Registro automático

## 🚀 Deploy en Vercel

1. Push a GitHub
2. Importa en [Vercel](https://vercel.com)
3. Configura variables de entorno
4. Deploy automático

## 📝 Licencia

MIT License

---

Hecho con 💚 para **La Granja de Pipe**
# Granja
