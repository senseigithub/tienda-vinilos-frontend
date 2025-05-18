import { useEffect, useState } from 'react';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('usuario');
    if (user) setUsuario(JSON.parse(user));
  }, []);

  if (!usuario) return <p className="px-4 sm:px-6 lg:px-8 text-gray-700">Cargando datos del perfil...</p>;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg mt-8 px-6 py-8">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Mi Perfil</h1>
      <div className="space-y-4 text-gray-800 text-base sm:text-lg">
        <p><span className="font-semibold text-gray-900">Nombre:</span> {usuario.nombre}</p>
        <p><span className="font-semibold text-gray-900">Apellidos:</span> {usuario.apellidos}</p>
        <p><span className="font-semibold text-gray-900">Correo electrónico:</span> {usuario.email}</p>
        <p><span className="font-semibold text-gray-900">Teléfono:</span> {usuario.telefono}</p>
      </div>
    </div>
  );
}
