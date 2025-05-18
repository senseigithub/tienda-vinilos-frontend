import { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    dnie: '',
    email: '',
    password: '',
    telefono: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error('Registro fallido');
      const data = await res.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      alert('Registro exitoso');
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Registro de usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="nombre" type="text" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="apellidos" type="text" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="dnie" type="text" placeholder="DNI/NIE" value={form.dnie} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="w-full p-2 border rounded" />
        <input name="telefono" type="text" placeholder="Teléfono" value={form.telefono} onChange={handleChange} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-black text-white py-2 rounded">
          Registrarse
        </button>
      </form>
    </div>
  );
}
