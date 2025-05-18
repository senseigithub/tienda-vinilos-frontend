import { useEffect, useState } from 'react';

export default function EditarPerfil() {
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({ nombre: '', apellidos: '', email: '', telefono: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('usuario');
    if (user) {
      const parsed = JSON.parse(user);
      setUsuario(parsed);
      setForm({
        nombre: parsed.nombre,
        apellidos: parsed.apellidos,
        email: parsed.email,
        telefono: parsed.telefono
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.email.includes('@')) return setError('Correo inválido.');
    if (!/^\d{9}$/.test(form.telefono)) return setError('Teléfono debe tener 9 dígitos.');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/api/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Error al actualizar perfil');

      const updated = await res.json();
      localStorage.setItem('usuario', JSON.stringify(updated));
      alert('Perfil actualizado correctamente');
    } catch (error) {
      setError(error.message);
    }
  };

  if (!usuario) return <p className="p-6 text-gray-700">Cargando datos...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow rounded-md mt-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Perfil</h1>
      {error && <p className="mb-4 text-sm text-red-600 font-medium">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-sm text-gray-700">Nombre</label>
          <input
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm text-gray-700">Apellidos</label>
          <input
            name="apellidos"
            type="text"
            value={form.apellidos}
            onChange={handleChange}
            className="w-full px-4 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm text-gray-700">Correo electrónico</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm text-gray-700">Teléfono</label>
          <input
            name="telefono"
            type="text"
            value={form.telefono}
            onChange={handleChange}
            className="w-full px-4 py-2 border text-black border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white font-semibold py-2 rounded hover:bg-gray-900 transition"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
