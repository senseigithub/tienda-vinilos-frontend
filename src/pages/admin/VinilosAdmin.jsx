import { useEffect, useState } from "react";

export default function AdminVinilos() {
  const [vinilos, setVinilos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({
    titulo: "",
    artista: "",
    genero: "",
    precio: "",
    stock: "",
    imagen: "",
    descripcion: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/api/vinilos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setVinilos)
      .catch(() => alert("Error al cargar vinilos"));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (vinilo) => {
    setEditandoId(vinilo.id);
    setForm({ ...vinilo });
  };

  const handleCancel = () => {
    setEditandoId(null);
    setForm({
      titulo: "",
      artista: "",
      genero: "",
      precio: "",
      stock: "",
      imagen: "",
      descripcion: "",
    });
  };

  const handleSave = async () => {
    const method = editandoId ? "PUT" : "POST";
    const url = editandoId
      ? `http://localhost:8000/api/vinilos/${editandoId}`
      : `http://localhost:8000/api/vinilos`;
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, proveedor_id: 1 }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      alert("Error al guardar vinilo");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este vinilo?")) return;
    const res = await fetch(`http://localhost:8000/api/vinilos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setVinilos(vinilos.filter((v) => v.id !== id));
    } else {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24 px-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-black mb-8">Administrar Vinilos</h1>

      <div className="overflow-x-auto shadow border rounded-lg">
        <table className="w-full text-left table-auto">
          <thead className="bg-[#FFA500] text-black font-semibold">
            <tr>
              <th className="px-4 py-2">Título</th>
              <th className="px-4 py-2">Artista</th>
              <th className="px-4 py-2">Género</th>
              <th className="px-4 py-2">Precio</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vinilos.map((vinilo) =>
              editandoId === vinilo.id ? (
                <tr key={vinilo.id} className="bg-gray-50">
                  <td className="px-4 py-2">
                    <input
                      name="titulo"
                      value={form.titulo}
                      onChange={handleChange}
                      className="w-full border p-1 rounded text-black"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      name="artista"
                      value={form.artista}
                      onChange={handleChange}
                      className="w-full border p-1 rounded text-black"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      name="genero"
                      value={form.genero}
                      onChange={handleChange}
                      className="w-full border p-1 rounded text-black"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      name="precio"
                      value={form.precio}
                      onChange={handleChange}
                      className="w-full border p-1 rounded text-black"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      className="w-full border p-1 rounded text-black"
                    />
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={handleSave}
                      className="bg-[#FFA500] text-black px-3 py-1 rounded border border-black hover:bg-[#FF8C00]"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-sm text-gray-600 hover:underline"
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={vinilo.id} className="hover:bg-gray-100 text-black">
                  <td className="px-4 py-2">{vinilo.titulo}</td>
                  <td className="px-4 py-2">{vinilo.artista}</td>
                  <td className="px-4 py-2">{vinilo.genero}</td>
                  <td className="px-4 py-2">{vinilo.precio} €</td>
                  <td className="px-4 py-2">{vinilo.stock}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(vinilo)}
                      className="bg-[#FFA500] text-black px-3 py-1 rounded border border-black hover:bg-[#FF8C00]"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(vinilo.id)}
                      className="bg-red-600 text-black px-3 py-1 rounded hover:bg-red-700"
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

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-black mb-2">Añadir nuevo vinilo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            name="titulo"
            placeholder="Título"
            value={form.titulo}
            onChange={handleChange}
            className="border p-2 rounded text-black"
          />
          <input
            name="artista"
            placeholder="Artista"
            value={form.artista}
            onChange={handleChange}
            className="border p-2 rounded text-black"
          />
          <input
            name="genero"
            placeholder="Género"
            value={form.genero}
            onChange={handleChange}
            className="border p-2 rounded text-black"
          />
          <input
            name="precio"
            placeholder="Precio"
            value={form.precio}
            onChange={handleChange}
            className="border p-2 rounded text-black"
          />
          <input
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            className="border p-2 rounded text-black"
          />
          <input
            name="imagen"
            placeholder="URL Imagen"
            value={form.imagen}
            onChange={handleChange}
            className="border p-2 rounded text-black"
          />
        </div>
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4 text-black"
          rows={3}
        />
        <button
          onClick={handleSave}
          className="bg-[#FFA500] text-black px-6 py-2 rounded border border-black hover:bg-[#FF8C00]"
        >
          Añadir vinilo
        </button>
      </div>
    </div>
  );
}
