import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";

export default function AdminDirecciones() {
  const [direcciones, setDirecciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/api/direcciones-envio", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setDirecciones);

    fetch("http://localhost:8000/api/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setUsuarios);
  }, []);

  const handleEdit = (direccion) => {
    setEditando(direccion.id);
    setForm({ ...direccion });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarCambios = async () => {
    const res = await fetch(`http://localhost:8000/api/direcciones-envio/${editando}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const actualizado = await res.json();
      setDirecciones(direcciones.map((d) => (d.id === editando ? actualizado : d)));
      setEditando(null);
    } else {
      alert("Error al guardar cambios.");
    }
  };

  const eliminarDireccion = async (id) => {
    const res = await fetch(`http://localhost:8000/api/direcciones-envio/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setDirecciones(direcciones.filter((d) => d.id !== id));
    } else {
      alert("No se pudo eliminar.");
    }
  };

  const buscarNombreUsuario = (usuarioId) => {
    const usuario = usuarios.find((u) => u.id === usuarioId);
    return usuario ? `${usuario.nombre} ${usuario.apellidos}` : "Desconocido";
  };

  const direccionesFiltradas = direcciones.filter((d) =>
    buscarNombreUsuario(d.usuario_id).toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="w-40 h-auto" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Administración de Direcciones
        </h1>

        <div className="mb-4 flex justify-end">
          <input
            type="text"
            placeholder="Buscar por usuario..."
            className="px-4 py-2 border border-gray-300 rounded text-black w-full sm:w-96"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto rounded shadow border">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-orange-100 text-black">
              <tr>
                <th className="px-6 py-3">Usuario</th>
                <th className="px-6 py-3">Dirección</th>
                <th className="px-6 py-3">Ciudad</th>
                <th className="px-6 py-3">Código Postal</th>
                <th className="px-6 py-3">Teléfono</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {direccionesFiltradas.map((d) => (
                <tr key={d.id} className="border-t">
                  {editando === d.id ? (
                    <>
                      <td className="px-6 py-2">{buscarNombreUsuario(d.usuario_id)}</td>
                      <td className="px-6 py-2">
                        <input
                          name="direccion"
                          value={form.direccion}
                          onChange={handleChange}
                          className="p-1 w-full border rounded text-black"
                        />
                      </td>
                      <td className="px-6 py-2">
                        <input
                          name="ciudad"
                          value={form.ciudad}
                          onChange={handleChange}
                          className="p-1 w-full border rounded text-black"
                        />
                      </td>
                      <td className="px-6 py-2">
                        <input
                          name="codigo_postal"
                          value={form.codigo_postal}
                          onChange={handleChange}
                          className="p-1 w-full border rounded text-black"
                        />
                      </td>
                      <td className="px-6 py-2">
                        <input
                          name="telefono"
                          value={form.telefono}
                          onChange={handleChange}
                          className="p-1 w-full border rounded text-black"
                        />
                      </td>
                      <td className="px-6 py-4 flex gap-2 justify-center">
                        <button
                          onClick={guardarCambios}
                          className="px-3 py-1 bg-[#FFA500] text-black font-medium border-2 border-black rounded hover:bg-[#FF8C00]"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setEditando(null)}
                          className="px-3 py-1 text-sm text-gray-600 hover:underline"
                        >
                          Cancelar
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">{buscarNombreUsuario(d.usuario_id)}</td>
                      <td className="px-6 py-4">{d.direccion}</td>
                      <td className="px-6 py-4">{d.ciudad}</td>
                      <td className="px-6 py-4">{d.codigo_postal}</td>
                      <td className="px-6 py-4">{d.telefono}</td>
                      <td className="px-6 py-4 flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(d)}
                          className="px-3 py-1 bg-[#FFA500] text-black font-medium border-2 border-black rounded hover:bg-[#FF8C00]"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarDireccion(d.id)}
                          className="px-3 py-1 bg-red-600 text-white font-medium border-2 border-black rounded hover:bg-red-700"
                        >
                          Eliminar
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
