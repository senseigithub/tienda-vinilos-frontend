import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";

export default function AdminLayout() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("usuario");
    if (user) {
      const parsed = JSON.parse(user);
      if (parsed.rol !== "admin") {
        navigate("/");
      } else {
        setUsuario(parsed);
      }
    } else {
      navigate("/login");
    }
  }, []);

  if (!usuario) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-md">
        <div className="p-6 border-b flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-10" />
          <span className="text-lg font-semibold text-black">Admin Panel</span>
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/admin" className="block px-4 py-2 rounded hover:bg-gray-100 text-black font-medium">Dashboard</Link>
          <Link to="/admin/vinilos" className="block px-4 py-2 rounded hover:bg-gray-100 text-black font-medium">Vinilos</Link>
          <Link to="/admin/pedidos" className="block px-4 py-2 rounded hover:bg-gray-100 text-black font-medium">Pedidos</Link>
          <Link to="/admin/usuarios" className="block px-4 py-2 rounded hover:bg-gray-100 text-black font-medium">Usuarios</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
