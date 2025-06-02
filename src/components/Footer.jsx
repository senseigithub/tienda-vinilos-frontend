export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1a1a1a] text-white mt-24 relative">
      {/* Franja gris con volver arriba */}
      <div className="bg-gray-800 py-4 text-center">
        <button
          onClick={scrollToTop}
          className="text-[#FFA500] hover:text-white hover:animate-bounce transition text-sm font-medium"
        >
          Volver arriba ↑
        </button>
      </div>

      {/* Cuerpo principal */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Columna 1: Logo y descripción */}
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold text-[#FFA500]">Groove & Stick Vinil</h2>
          <p className="text-gray-400">
            En Groove & Stick Vinil nos apasiona el sonido analógico. Descubre ediciones limitadas, rarezas y clásicos que marcaron época.
          </p>
        </div>

        {/* Columna 2: Información de contacto */}
        <div className="space-y-4 animate-fade-in delay-100">
          <h3 className="text-xl font-semibold text-[#FFA500]">Soporte</h3>
          <p className="text-gray-400">Email: soporte@grooveandstick.com</p>
          <p className="text-gray-400">Teléfono: +34 600 123 456</p>
          <p className="text-gray-400">Horario: Lunes a Viernes, 9:00 - 18:00</p>
        </div>

        {/* Columna 3: Redes sociales */}
        <div className="space-y-4 animate-fade-in delay-200">
          <h3 className="text-xl font-semibold text-[#FFA500]">Síguenos</h3>
          <div className="flex space-x-4">
            <a
              href="#"
              className="hover:text-[#FFA500] transform hover:scale-110 transition-transform"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram text-2xl"></i>
            </a>
            <a
              href="#"
              className="hover:text-[#FFA500] transform hover:scale-110 transition-transform"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter text-2xl"></i>
            </a>
            <a
              href="#"
              className="hover:text-[#FFA500] transform hover:scale-110 transition-transform"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook text-2xl"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Derechos al pie */}
      <div className="border-t border-gray-700 py-4 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Groove & Stick Vinil. Todos los derechos reservados.
      </div>

      {/* Animaciones CSS */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .hover\\:animate-bounce:hover {
          animation: bounce 0.6s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </footer>
  );
}
