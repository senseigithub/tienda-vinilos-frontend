import { useEffect, useState } from 'react';

export default function Direcciones() {
  const [direcciones, setDirecciones] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({ direccion: '', ciudad: '', codigo_postal: '', telefono: '' });
  const [addingNew, setAddingNew] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/direcciones-envio', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setDirecciones(data));
  }, []);

  const handleEdit = (direccion, index) => {
    setEditIndex(index);
    setForm({
      direccion: direccion.direccion,
      ciudad: direccion.ciudad,
      codigo_postal: direccion.codigo_postal,
      telefono: direccion.telefono,
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8000/api/direcciones-envio/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    const nuevas = [...direcciones];
    nuevas[editIndex] = updated;
    setDirecciones(nuevas);
    setEditIndex(null);
  };

  const handleAdd = async () => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const res = await fetch(`http://localhost:8000/api/direcciones-envio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, usuario_id: usuario.id }),
    });
    const nueva = await res.json();
    setDirecciones([...direcciones, nueva]);
    setForm({ direccion: '', ciudad: '', codigo_postal: '', telefono: '' });
    setAddingNew(false);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:8000/api/direcciones-envio/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setDirecciones(direcciones.filter((dir) => dir.id !== id));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Direcciones de Envío</h1>
      {direcciones.map((dir, index) => (
        <div key={dir.id} className="mb-6 p-4 bg-white shadow rounded">
          {editIndex === index ? (
            <>
              <input name="direccion" value={form.direccion} onChange={handleChange} className="mb-2 w-full p-2 border rounded" />
              <input name="ciudad" value={form.ciudad} onChange={handleChange} className="mb-2 w-full p-2 border rounded" />
              <input name="codigo_postal" value={form.codigo_postal} onChange={handleChange} className="mb-2 w-full p-2 border rounded" />
              <input name="telefono" value={form.telefono} onChange={handleChange} className="mb-2 w-full p-2 border rounded" />
              <div className="flex gap-2">
                <button onClick={() => handleUpdate(dir.id)} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900">
                  Guardar cambios
                </button>
                <button onClick={() => setEditIndex(null)} className="text-sm text-gray-600 hover:underline">
                  Cancelar
                </button>
              </div>
            </>
          ) : (
            <>
              <p><strong>Dirección:</strong> {dir.direccion}</p>
              <p><strong>Ciudad:</strong> {dir.ciudad}</p>
              <p><strong>Código Postal:</strong> {dir.codigo_postal}</p>
              <p><strong>Teléfono:</strong> {dir.telefono}</p>
              <div className="flex gap-4 mt-2">
                <button onClick={() => handleEdit(dir, index)} className="text-sm text-blue-600 hover:underline">
                  Editar
                </button>
                <button onClick={() => handleDelete(dir.id)} className="text-sm text-red-600 hover:underline">
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      <div className="mt-8">
        {!addingNew ? (
          <button onClick={() => setAddingNew(true)} className="text-sm text-blue-700 hover:underline">
            + Añadir nueva dirección
          </button>
        ) : (
          <div className="mt-4 p-4 bg-gray-50 border rounded">
            <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" className="mb-2 w-full p-2 border rounded" />
            <input name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Ciudad" className="mb-2 w-full p-2 border rounded" />
            <input name="codigo_postal" value={form.codigo_postal} onChange={handleChange} placeholder="Código Postal" className="mb-2 w-full p-2 border rounded" />
            <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="mb-2 w-full p-2 border rounded" />
            <button onClick={handleAdd} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900">
              Guardar dirección
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
