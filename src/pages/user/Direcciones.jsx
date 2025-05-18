import { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';

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
    if (!form.direccion || !form.ciudad || !form.codigo_postal || !form.telefono) {
      alert('Por favor completa todos los campos antes de guardar.');
      return;
    }
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
    if (!form.direccion || !form.ciudad || !form.codigo_postal || !form.telefono) {
      alert('Por favor completa todos los campos antes de guardar.');
      return;
    }
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
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl bg-white border border-orange-400 shadow-lg rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-32 h-auto mb-4" />
          <h1 className="text-3xl font-bold text-black">Direcciones de Envío</h1>
        </div>

        {direcciones.map((dir, index) => (
          <div key={dir.id} className="mb-6 p-5 bg-white border border-orange-400 shadow rounded-xl">
            {editIndex === index ? (
              <>
                <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" className="mb-2 w-full p-2 border rounded text-black" />
                <input name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Ciudad" className="mb-2 w-full p-2 border rounded text-black" />
                <input name="codigo_postal" value={form.codigo_postal} onChange={handleChange} placeholder="Código Postal" className="mb-2 w-full p-2 border rounded text-black" />
                <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="mb-2 w-full p-2 border rounded text-black" />
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(dir.id)} className="px-4 py-2 border-2 border-black bg-[#FFA500] text-black font-semibold rounded-full hover:scale-105 hover:bg-[#FF8C00] transition-transform">
                    Guardar cambios
                  </button>
                  <button onClick={() => setEditIndex(null)} className="text-sm text-gray-600 hover:underline">
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-black"><strong>Dirección:</strong> {dir.direccion}</p>
                <p className="text-black"><strong>Ciudad:</strong> {dir.ciudad}</p>
                <p className="text-black"><strong>Código Postal:</strong> {dir.codigo_postal}</p>
                <p className="text-black"><strong>Teléfono:</strong> {dir.telefono}</p>
                <div className="flex gap-4 mt-2">
                  <button onClick={() => handleEdit(dir, index)} className="px-4 py-1 border-2 border-black bg-[#FFA500] text-black font-semibold rounded-full hover:scale-105 hover:bg-[#FF8C00] transition-transform text-sm">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(dir.id)} className="px-4 py-1 border-2 border-black bg-red-500 text-white font-semibold rounded-full hover:scale-105 hover:bg-red-600 transition-transform text-sm">
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        <div className="mt-8">
          {!addingNew ? (
            <button onClick={() => setAddingNew(true)} className="text-sm text-orange-600 hover:underline font-medium">
              + Añadir nueva dirección
            </button>
          ) : (
            <div className="mt-4 p-5 bg-white border border-orange-400 shadow rounded-xl">
              <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" className="mb-2 w-full p-2 border rounded text-black" />
              <input name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Ciudad" className="mb-2 w-full p-2 border rounded text-black" />
              <input name="codigo_postal" value={form.codigo_postal} onChange={handleChange} placeholder="Código Postal" className="mb-2 w-full p-2 border rounded text-black" />
              <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="mb-4 w-full p-2 border rounded text-black" />
              <button onClick={handleAdd} className="px-4 py-2 border-2 border-black bg-[#FFA500] text-black font-semibold rounded-full hover:scale-105 hover:bg-[#FF8C00] transition-transform">
                Guardar dirección
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
