import Link from 'next/link';

interface PublicFooterProps {
  whatsappNumber?: string;
  email?: string;
  address?: string;
}

export function PublicFooter({ 
  whatsappNumber = '123456789',
  email = 'info@lagranjadevpipe.com',
  address = 'Tu ciudad'
}: PublicFooterProps) {
  return (
    <footer className="border-t py-8 lg:py-12 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 lg:gap-8 md:grid-cols-3 mb-6 lg:mb-8">
          <div>
            <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
              <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-xl lg:text-2xl">
                🐾
              </div>
              <h3 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                La Granja de Pipe
              </h3>
            </div>
            <p className="text-sm lg:text-base text-gray-400">
              Cuidado veterinario profesional con más de 15 años de experiencia. Tu mascota es nuestra familia.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-3 lg:mb-4 text-base lg:text-lg">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm lg:text-base text-gray-400">
              <li>
                <Link href="/" className="hover:text-green-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/productos" className="hover:text-green-400 transition-colors">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/productos" className="hover:text-green-400 transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-green-400 transition-colors">
                  Iniciar Sesión
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 lg:mb-4 text-base lg:text-lg">Contacto</h4>
            <ul className="space-y-2 text-sm lg:text-base text-gray-400">
              <li>
                📞 WhatsApp:{' '}
                <a 
                  href={`https://wa.me/${whatsappNumber}`} 
                  className="hover:text-green-400 transition-colors"
                >
                  +{whatsappNumber}
                </a>
              </li>
              <li>📧 Email: {email}</li>
              <li>📍 Dirección: {address}</li>
              <li>🕒 Horario: 24/7 Emergencias</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-4 lg:pt-6 text-center text-sm lg:text-base text-gray-400">
          <p>
            © 2026 <strong className="text-green-400">La Granja de Pipe</strong>. Todos los derechos reservados. 
            Hecho con 💚 para tus mascotas.
          </p>
        </div>
      </div>
    </footer>
  );
}
