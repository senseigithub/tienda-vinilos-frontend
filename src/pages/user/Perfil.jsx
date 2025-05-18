import { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', apellidos: '', email: '', telefono: '' });

  useEffect(() => {
    const user = localStorage.getItem('usuario');
    if (user) {
      const datos = JSON.parse(user);
      setUsuario(datos);
      setFormData({
        nombre: datos.nombre,
        apellidos: datos.apellidos,
        email: datos.email,
        telefono: datos.telefono,
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const guardarCambios = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8000/api/usuarios/${usuario.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const actualizado = { ...usuario, ...formData };
      localStorage.setItem('usuario', JSON.stringify(actualizado));
      setUsuario(actualizado);
      setEditando(false);
    }
  };

  if (!usuario) return <p className="px-4 sm:px-6 lg:px-8 text-gray-700">Cargando datos del perfil...</p>;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl bg-white border border-orange-400 shadow-lg rounded-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="w-32 h-auto mb-4" />
          <h1 className="text-4xl font-bold text-black">Mi Perfil</h1>
        </div>

        <div className="space-y-4 text-gray-800 text-lg">
          {['nombre', 'apellidos', 'email', 'telefono'].map((campo) => (
            <div key={campo}>
              <label className="font-semibold text-black block capitalize">{campo}:</label>
              {editando ? (
                <input
                  type="text"
                  name={campo}
                  value={formData[campo]}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border border-gray-300 rounded text-black"
                />
              ) : (
                <p>{usuario[campo]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center gap-4">
          {editando ? (
            <>
              <button
                onClick={guardarCambios}
                className="px-6 py-2 border-2 border-black bg-[#FFA500] text-black font-semibold rounded-full hover:scale-105 hover:bg-[#FF8C00] transition-transform"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setEditando(false)}
                className="px-6 py-2 border-2 border-gray-400 text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditando(true)}
              className="px-6 py-2 border-2 border-black bg-[#FFA500] text-black font-semibold rounded-full hover:scale-105 hover:bg-[#FF8C00] transition-transform"
            >
              Editar Perfil
            </button>
          )}
        </div>
      </div>
    </div>
  );
}