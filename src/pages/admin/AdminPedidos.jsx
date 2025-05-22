import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/api/pedidos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPedidos(data));
  }, []);

  const actualizarEstado = async (id, nuevoEstado) => {
    const res = await fetch(`http://localhost:8000/api/pedidos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    });

    if (res.ok) {
      setPedidos(pedidos.map((p) => (p.id === id ? { ...p, estado: nuevoEstado } : p)));
    } else {
      alert("No se pudo actualizar el estado");
    }
  };

  const eliminarPedido = async (id) => {
  const res = await fetch(`http://localhost:8000/api/pedidos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (res.ok) {
    setPedidos(pedidos.filter((p) => p.id !== id));
  } else {
    alert("Error al eliminar el pedido.");
  }
};


  const estados = ["Pendiente", "Completado", "Cancelado"];

  const pedidosFiltrados = pedidos.filter((p) =>
    p.usuario?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-40 h-auto" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Administración de Pedidos
        </h1>

        <div className="flex justify-end mb-4">
          <input
            type="text"
            placeholder="Buscar por usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="p-2 border border-gray-300 rounded text-black"
          />
        </div>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white text-black border border-gray-200">
            <thead>
              <tr className="bg-[#FFA500] text-black">
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Usuario</th>
                <th className="px-4 py-2 border">Fecha</th>
                <th className="px-4 py-2 border">Total</th>
                <th className="px-4 py-2 border">Método Pago</th>
                <th className="px-4 py-2 border">Estado</th>
                <th className="px-4 py-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border text-center">{p.id}</td>
                  <td className="px-4 py-2 border">
                    {p.usuario?.nombre} {p.usuario?.apellidos}
                  </td>
                  <td className="px-4 py-2 border">{new Date(p.fecha_pedido).toLocaleString()}</td>
                  <td className="px-4 py-2 border">{p.total} €</td>
                  <td className="px-4 py-2 border">{p.metodo_pago}</td>
                  <td className="px-4 py-2 border">
                    <select
                      value={p.estado}
                      onChange={(e) => actualizarEstado(p.id, e.target.value)}
                      className="p-1 border border-black rounded text-black"
                    >
                      {estados.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => eliminarPedido(p.id)}
                      className="px-3 py-1 bg-red-600 text-white border-2 border-black rounded hover:bg-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {pedidosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                    No se encontraron pedidos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
