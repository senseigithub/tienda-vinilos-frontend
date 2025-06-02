export default function Footer() {
  return (
    <footer className="bg-black text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-[#FFA500]">Vinilos Montes</h3>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Adrián Montes Bastida. Todos los derechos reservados.
          </p>
        </div>

        <div className="flex gap-4">
          <a
            href="#"
            className="text-gray-300 hover:text-[#FFA500] transition"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook fa-lg"></i>
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-[#FFA500] transition"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram fa-lg"></i>
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-[#FFA500] transition"
            aria-label="Twitter"
          >
            <i className="fab fa-twitter fa-lg"></i>
          </a>
        </div>

        <div className="text-center md:text-right">
          <p className="text-sm">
            Hecho con <span className="text-red-500">❤️</span> por Adrián Montes Bastida
          </p>
          <a
            href="mailto:contacto@vinilosmontes.com"
            className="text-sm text-gray-400 hover:text-[#FFA500] transition"
          >
            contacto@vinilosmontes.com
          </a>
        </div>
      </div>
    </footer>
  );
}
