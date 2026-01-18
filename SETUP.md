# 🚀 Configuración Rápida

## Pasos para ejecutar el proyecto

### 1. Crear archivo .env

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura tu DATABASE_URL con PostgreSQL.

### 2. Instalar dependencias (si no lo has hecho)

```bash
npm install
```

### 3. Configurar base de datos

```bash
# Generar cliente Prisma
npx prisma generate

# Aplicar schema
npx prisma db push

# Poblar con datos de prueba
npm run prisma:seed
```

### 4. Iniciar servidor

```bash
npm run dev
```

### 5. Acceder a la aplicación

- **Landing Pública**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login

**Credenciales por defecto:**

- Email: `admin@veterinaria.com`
- Password: `admin123`

## 📌 Notas Importantes

1. **PostgreSQL**: Asegúrate de tener PostgreSQL corriendo y una base de datos creada
2. **NEXTAUTH_SECRET**: En producción, genera un secret seguro con: `openssl rand -base64 32`
3. **Prisma**: Si cambias el schema, ejecuta `npx prisma db push` nuevamente
4. **Seed**: El seed crea:
   - 1 usuario SUPER_ADMIN
   - 8 productos/servicios de ejemplo
   - 3 banners de ejemplo

## 🎨 Características Implementadas

✅ Autenticación segura con NextAuth.js
✅ Dashboard con KPIs y gráficas interactivas
✅ Sistema POS para ventas rápidas
✅ Control de gastos
✅ CRUD completo de productos/servicios y banners
✅ Modo oscuro/claro
✅ Landing pública responsive
✅ Filtros por periodo (día, semana, mes, etc.)

## 🐛 Troubleshooting

### Error de conexión a la base de datos

Verifica que PostgreSQL esté corriendo y que el DATABASE_URL sea correcto.

### Error "Module not found"

Ejecuta `npm install` nuevamente.

### Errores de Prisma

```bash
npx prisma generate
npx prisma db push
```

### El admin no carga

Verifica que hayas ejecutado el seed: `npm run prisma:seed`
