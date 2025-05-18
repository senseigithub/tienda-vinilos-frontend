import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

export default function Register() {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    dnie: '',
    email: '',
    password: '',
    confirmar: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dniRegex = /^\d{8}[A-HJ-NP-TV-Z]$/i;
    const phoneRegex = /^\d{9}$/;

    if (Object.values(form).some(val => !val)) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    if (!emailRegex.test(form.email)) {
      setError('Introduce un correo electrónico válido.');
      return;
    }
    if (!dniRegex.test(form.dnie)) {
      setError('Introduce un DNI válido (8 números y una letra).');
      return;
    }
    if (!phoneRegex.test(form.telefono)) {
      setError('Introduce un número de teléfono válido (9 dígitos).');
      return;
    }
    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const { confirmar, ...datosAEnviar } = form;

    try {
      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAEnviar)
      });

      if (!res.ok) throw new Error('Registro fallido');
      const data = await res.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      navigate('/');
      window.location.reload();
    } catch (err) {
      setError('Error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white border border-orange-400 shadow-lg rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-32 h-auto mb-4" />
          <h1 className="text-3xl font-bold text-black">Registro de usuario</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="nombre" type="text" placeholder="Nombre" value={form.nombre} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded text-black" />
          <input name="apellidos" type="text" placeholder="Apellidos" value={form.apellidos} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded text-black" />
          <input name="dnie" type="text" placeholder="DNI/NIE" value={form.dnie} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded text-black" />
          <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded text-black" />
          <div className="relative">
            <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Contraseña" value={form.password} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded text-black" />
            <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 cursor-pointer text-sm text-orange-600">{showPassword ? '🙈' : '👁️'}</span>
          </div>
          <div className="relative">
            <input name="confirmar" type={showConfirm ? 'text' : 'password'} placeholder="Confirmar contraseña" value={form.confirmar} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded text-black" />
            <span onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3 cursor-pointer text-sm text-orange-600">{showConfirm ? '🙈' : '👁️'}</span>
          </div>
          <input name="telefono" type="text" placeholder="Teléfono" value={form.telefono} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded text-black" />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" className="w-full px-4 py-2 border-2 border-black bg-[#FFA500] text-black font-semibold rounded-full hover:scale-105 hover:bg-[#FF8C00] transition-transform">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}