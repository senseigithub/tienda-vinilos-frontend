import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";

export default function AdminProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const [nuevo, setNuevo] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/api/proveedores", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setProveedores);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (proveedor) => {
    setEditando(proveedor.id);
    setForm({ ...proveedor });
  };

  const guardarCambios = async () => {
    console.log("Editando proveedor ID:", editando);
    console.log("Datos que se envían al backend:", form);

    const res = await fetch(
      `http://localhost:8000/api/proveedores/${editando}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();
    console.log("Respuesta del backend:", data);

    if (res.ok) {
      setProveedores(proveedores.map((p) => (p.id === data.id ? data : p)));
      setEditando(null);
      setForm({});
    } else {
      alert("No se pudo guardar.");
    }
  };

  const eliminarProveedor = async (id) => {
    console.log("Intentando eliminar proveedor con ID:", id);

    try {
      const res = await fetch(`http://localhost:8000/api/proveedores/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const responseBody = await res.json();
      console.log("Respuesta del backend:", responseBody);

      if (res.ok) {
        setProveedores(proveedores.filter((p) => p.id !== id));
        console.log("Proveedor eliminado en frontend.");
      } else {
        console.error("Error al eliminar proveedor:", responseBody);
        alert("No se pudo eliminar.");
      }
    } catch (error) {
      console.error("Error en la petición DELETE:", error);
      alert("Error inesperado al eliminar.");
    }
  };

  const crearProveedor = async () => {
    const res = await fetch("http://localhost:8000/api/proveedores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const creado = await res.json();
      setProveedores([...proveedores, creado]);
      setForm({});
      setNuevo(false);
    } else {
      alert("No se pudo crear.");
    }
  };

  const filtrados = proveedores.filter((p) =>
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-40 h-auto" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Administración de Proveedores
        </h1>

        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="px-4 py-2 border border-gray-300 rounded text-black w-full sm:w-96"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            onClick={() => {
              setNuevo(true);
              setForm({ nombre: "", email: "", telefono: "", direccion: "" });
            }}
            className="ml-4 px-4 py-2 bg-[#FFA500] border-2 border-black rounded text-black hover:bg-[#FF8C00]"
          >
            Nuevo Proveedor
          </button>
        </div>

        <div className="overflow-x-auto rounded shadow border">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-orange-100 text-black">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Correo</th>
                <th className="px-6 py-3">Teléfono</th>
                <th className="px-6 py-3">Dirección</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {nuevo && (
                <tr key="nuevo" className="border-t bg-yellow-50">
                  <td className="px-6 py-2">
                    <input
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      className="w-full border rounded p-1 text-black"
                    />
                  </td>
                  <td className="px-6 py-2">
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full border rounded p-1 text-black"
                    />
                  </td>
                  <td className="px-6 py-2">
                    <input
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                      className="w-full border rounded p-1 text-black"
                    />
                  </td>
                  <td className="px-6 py-2">
                    <input
                      name="direccion"
                      value={form.direccion}
                      onChange={handleChange}
                      className="w-full border rounded p-1 text-black"
                    />
                  </td>
                  <td className="px-6 py-2 flex gap-2 justify-center">
                    <button
                      onClick={crearProveedor}
                      className="px-3 py-1 bg-[#FFA500] text-black border-2 border-black rounded hover:bg-[#FF8C00]"
                    >
                      Crear
                    </button>
                    <button
                      onClick={() => setNuevo(false)}
                      className="text-sm text-gray-600 hover:underline"
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              )}

              {filtrados.map((p) =>
                editando === p.id ? (
                  <tr key={p.id} className="border-t bg-yellow-50">
                    <td className="px-6 py-2">
                      <input
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        className="w-full border rounded p-1 text-black"
                      />
                    </td>
                    <td className="px-6 py-2">
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border rounded p-1 text-black"
                      />
                    </td>
                    <td className="px-6 py-2">
                      <input
                        name="telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        className="w-full border rounded p-1 text-black"
                      />
                    </td>
                    <td className="px-6 py-2">
                      <input
                        name="direccion"
                        value={form.direccion}
                        onChange={handleChange}
                        className="w-full border rounded p-1 text-black"
                      />
                    </td>
                    <td className="px-6 py-2 flex gap-2 justify-center">
                      <button
                        onClick={guardarCambios}
                        className="px-3 py-1 bg-[#FFA500] text-black border-2 border-black rounded hover:bg-[#FF8C00]"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditando(null)}
                        className="text-sm text-gray-600 hover:underline"
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={p.id} className="border-t">
                    <td className="px-6 py-2">{p.nombre}</td>
                    <td className="px-6 py-2">{p.email}</td>
                    <td className="px-6 py-2">{p.telefono}</td>
                    <td className="px-6 py-2">{p.direccion}</td>
                    <td className="px-6 py-2 flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(p)}
                        className="px-3 py-1 bg-[#FFA500] text-black border-2 border-black rounded hover:bg-[#FF8C00]"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarProveedor(p.id)}
                        className="px-3 py-1 bg-red-600 text-white border-2 border-black rounded hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
