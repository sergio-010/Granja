#!/bin/bash

# Script para desplegar a Vercel
# Ejecuta: bash deploy.sh

echo "🚀 Iniciando deployment a Vercel..."
echo ""

# Verificar que esté instalado Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI no está instalado."
    echo "Instala con: npm i -g vercel"
    echo ""
    read -p "¿Quieres instalarlo ahora? (s/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        npm i -g vercel
    else
        exit 1
    fi
fi

# Verificar build local
echo "🔨 Verificando build local..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build falló. Corrige los errores antes de deployar."
    exit 1
fi

echo "✅ Build exitoso!"
echo ""

# Opciones de deployment
echo "Opciones de deployment:"
echo "1) Deploy preview (testing)"
echo "2) Deploy a producción"
echo "3) Solo login"
read -p "Selecciona una opción (1-3): " option

case $option in
    1)
        echo "📦 Deploying preview..."
        vercel
        ;;
    2)
        echo "🚀 Deploying a producción..."
        vercel --prod
        ;;
    3)
        echo "🔐 Iniciando login..."
        vercel login
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "✨ ¡Deployment completado!"
echo "📝 Recuerda configurar las variables de entorno en Vercel Dashboard"
