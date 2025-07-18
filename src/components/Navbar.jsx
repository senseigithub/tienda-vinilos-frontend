import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import CarritoSidebar from "../components/CarritoSidebar";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [carritoCount, setCarritoCount] = useState(0);
  const [bump, setBump] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownTimeout = useRef(null);

  useEffect(() => {
    const user = localStorage.getItem("usuario");
    if (user) {
      const parsed = JSON.parse(user);
      setUsuario(parsed);
      actualizarContador(parsed.carrito ? JSON.parse(parsed.carrito) : []);
    }
  }, [location]);

  const actualizarContador = (carrito) => {
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    setCarritoCount(total);
    setBump(true);
    setTimeout(() => setBump(false), 300);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setBusqueda(params.get("query") || "");
  }, [location.search]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/");
    window.location.reload();
  };

  const handleSearch = (value) => {
    setBusqueda(value);
    navigate(`/?query=${encodeURIComponent(value)}`);
  };

  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeout.current);
    setOpenDropdown(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setOpenDropdown(false);
    }, 500);
  };

  return (
    <>
      <nav className="bg-white text-gray-900 border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-900 hover:text-black"
          >
            <img src={logo} alt="Logo" className="h-25 w-auto" />
          </Link>

          <div className="w-full sm:w-auto flex-1 sm:mx-8">
            <input
              type="text"
              placeholder="Buscar vinilo o artista..."
              className="w-full px-4 py-2 border border-gray-300 bg-gray-50 text-gray-900 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
              value={busqueda}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="relative flex items-center gap-4">
            <div
              className="relative cursor-pointer"
              onClick={() => setSidebarAbierto(true)}
            >
              <span className="text-xl text-gray-700 hover:text-orange-500">
                <img
                  src="/src/assets/carrito.svg"
                  alt="Carrito"
                  className="w-8 h-8"
                />
              </span>
              {carritoCount > 0 && (
                <span
                  className={`absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-transform ${
                    bump ? "animate-bump" : ""
                  }`}
                >
                  {carritoCount}
                </span>
              )}
            </div>

            {!usuario ? (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 border-2 border-black bg-[#FFA500] text-black font-semibold rounded-full hover:scale-105 hover:bg-[#FF8C00] transition-transform"
              >
                Login
              </button>
            ) : (
              <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className="text-xl cursor-pointer text-gray-800">
                  <img
                    src="/src/assets/perfil.svg"
                    alt="Perfil"
                    className="w-8 h-8"
                  />
                </span>
                {openDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border-2 border-orange-500 rounded shadow-md z-50">
                    <Link
                      to="/perfil"
                      className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                    >
                      Mi perfil
                    </Link>
                    <Link
                      to="/direcciones"
                      className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                    >
                      Direcciones de envío
                    </Link>
                    <Link
                      to="/pedidos"
                      className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                    >
                      Mis pedidos
                    </Link>
                    {usuario?.rol === "admin" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                      >
                      Panel de administración
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <CarritoSidebar
        open={sidebarAbierto}
        onClose={() => setSidebarAbierto(false)}
        onUpdateCarrito={actualizarContador}
      />

      <style>{`
        .animate-bump {
          animation: bump 300ms ease-out;
        }
        @keyframes bump {
          0% { transform: scale(1); }
          10% { transform: scale(1.3); }
          30% { transform: scale(0.9); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}
