import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const panels = [
    { label: "🎵 Vinilos", path: "/admin/vinilos" },
    { label: "👥 Usuarios", path: "/admin/usuarios" },
    { label: "🏠 Direcciones", path: "/admin/direcciones" },
    { label: "🏢 Proveedores", path: "/admin/proveedores" },
    { label: "📦 Pedidos", path: "/admin/pedidos" },
  ];

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-40 h-auto" />
        </div>
        <h1 className="text-4xl font-bold text-center text-black mb-10 border-b-4 border-[#FFA500] pb-4">
          Panel de Administración
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {panels.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              className="cursor-pointer bg-white border-2 border-orange-300 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all p-6 flex flex-col items-center justify-center"
            >
              <span className="text-5xl mb-4">{item.label.split(" ")[0]}</span>
              <span className="text-xl font-semibold text-black text-center">
                {item.label.split(" ").slice(1).join(" ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
