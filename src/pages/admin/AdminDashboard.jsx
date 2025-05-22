import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Panel de Administración
        </h1>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => navigate("/admin/vinilos")}
              className="w-full text-left bg-orange-100 hover:bg-orange-200 p-4 rounded shadow text-xl font-medium text-black transition"
            >
              🎵 Vinilos
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/usuarios")}
              className="w-full text-left bg-orange-100 hover:bg-orange-200 p-4 rounded shadow text-xl font-medium text-black transition"
            >
              👥 Usuarios
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/direcciones")}
              className="w-full text-left bg-orange-100 hover:bg-orange-200 p-4 rounded shadow text-xl font-medium text-black transition"
            >
              🏠 Direcciones
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/proveedores")}
              className="w-full text-left bg-orange-100 hover:bg-orange-200 p-4 rounded shadow text-xl font-medium text-black transition"
            >
              🏢 Proveedores
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/admin/pedidos")}
              className="w-full text-left bg-orange-100 hover:bg-orange-200 p-4 rounded shadow text-xl font-medium text-black transition"
            >
              📦 Pedidos
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
