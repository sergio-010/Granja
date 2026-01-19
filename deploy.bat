@echo off
REM Script para desplegar a Vercel en Windows
REM Ejecuta: deploy.bat

echo 🚀 Iniciando deployment a Vercel...
echo.

REM Verificar que esté instalado Vercel CLI
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Vercel CLI no está instalado.
    echo Instala con: npm i -g vercel
    echo.
    set /p install="¿Quieres instalarlo ahora? (s/n): "
    if /i "%install%"=="s" (
        call npm i -g vercel
    ) else (
        exit /b 1
    )
)

REM Verificar build local
echo 🔨 Verificando build local...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build falló. Corrige los errores antes de deployar.
    exit /b 1
)

echo ✅ Build exitoso!
echo.

REM Opciones de deployment
echo Opciones de deployment:
echo 1) Deploy preview (testing)
echo 2) Deploy a producción
echo 3) Solo login
set /p option="Selecciona una opción (1-3): "

if "%option%"=="1" (
    echo 📦 Deploying preview...
    call vercel
) else if "%option%"=="2" (
    echo 🚀 Deploying a producción...
    call vercel --prod
) else if "%option%"=="3" (
    echo 🔐 Iniciando login...
    call vercel login
) else (
    echo ❌ Opción inválida
    exit /b 1
)

echo.
echo ✨ ¡Deployment completado!
echo 📝 Recuerda configurar las variables de entorno en Vercel Dashboard
pause
