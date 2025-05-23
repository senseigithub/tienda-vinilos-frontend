import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/api/usuarios", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setUsuarios);
  }, []);

  const handleEdit = (usuario) => {
    setEditando(usuario.id);
    setForm({ ...usuario });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarCambios = async () => {
    const res = await fetch(`http://localhost:8000/api/usuarios/${editando}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const actualizado = await res.json();
      setUsuarios(usuarios.map((u) => (u.id === editando ? actualizado : u)));
      setEditando(null);
    } else {
      alert("Error al guardar cambios.");
    }
  };

  const eliminarUsuario = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este usuario?")) return;

    const res = await fetch(`http://localhost:8000/api/usuarios/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setUsuarios(usuarios.filter((u) => u.id !== id));
    } else {
      alert("No se pudo eliminar.");
    }
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.nombre} ${u.apellidos} ${u.email}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="w-40 h-auto" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Administración de Usuarios
        </h1>

        <div className="mb-4 flex justify-end">
          <input
            type="text"
            placeholder="Buscar usuario..."
            className="px-4 py-2 border border-gray-300 rounded text-black w-full sm:w-96"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto rounded shadow border">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-orange-100 text-black">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Apellidos</th>
                <th className="px-6 py-3">Correo</th>
                <th className="px-6 py-3">Teléfono</th>
                <th className="px-6 py-3">DNI/NIE</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((u) => (
                <tr key={u.id} className="border-t">
                  {editando === u.id ? (
                    <>
                      <td className="px-6 py-4">{u.id}</td>
                      <td className="px-6 py-2">
                        <input
                          name="nombre"
                          value={form.nombre}
                          onChange={handleChange}
                          className="p-1 w-full border rounded text-black"
                        />
                      </td>
                      <td className="px-6 py-2">
                        <input
                          name="apellidos"
                          value={form.apellidos}
                          onChange={handleChange}
                          className="p-1 w-full border rounded text-black"
                        />
                      </td>
                      <td className="px-6 py-2">
                        <input
                          name="email"
                          value={form.email}
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
                      <td className="px-6 py-2">
                        <input
                          name="dnie"
                          value={form.dnie}
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
                      <td className="px-6 py-4">{u.id}</td>
                      <td className="px-6 py-4">{u.nombre}</td>
                      <td className="px-6 py-4">{u.apellidos}</td>
                      <td className="px-6 py-4">{u.email}</td>
                      <td className="px-6 py-4">{u.telefono}</td>
                      <td className="px-6 py-4">{u.dnie}</td>
                      <td className="px-6 py-4 flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(u)}
                          className="px-3 py-1 bg-[#FFA500] text-black font-medium border-2 border-black rounded hover:bg-[#FF8C00]"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarUsuario(u.id)}
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
