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
    `${p.usuario?.nombre} ${p.usuario?.apellidos}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-40 h-auto" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Administración de Pedidos
        </h1>

        <div className="mb-4 flex justify-end">
          <input
            type="text"
            placeholder="Buscar por usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-black w-full sm:w-96"
          />
        </div>

        <div className="overflow-x-auto rounded shadow border">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-orange-100 text-black">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Usuario</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Método Pago</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{p.id}</td>
                  <td className="px-6 py-4">
                    {p.usuario?.nombre} {p.usuario?.apellidos}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(p.fecha_pedido).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">{p.total} €</td>
                  <td className="px-6 py-4">{p.metodo_pago}</td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4 flex justify-center">
                    <button
                      onClick={() => eliminarPedido(p.id)}
                      className="px-3 py-1 bg-red-600 text-white font-medium border-2 border-black rounded hover:bg-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {pedidosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-6 text-center text-gray-500">
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
