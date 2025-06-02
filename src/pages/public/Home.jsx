import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Home() {
  const [vinilos, setVinilos] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [filtros, setFiltros] = useState({ artista: '', genero: '', precioMin: '', precioMax: '' });
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [mostrarArtistas, setMostrarArtistas] = useState(false);
  const [mostrarGeneros, setMostrarGeneros] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';

    fetch(`http://localhost:8000/api/vinilos${query ? `?search=${encodeURIComponent(query)}` : ''}`)
      .then(res => res.json())
      .then(data => {
        setVinilos(data);
        setFiltrados(data);
      });
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarAbierto && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarAbierto(false);
      }
    };

    if (sidebarAbierto) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarAbierto]);

  const aplicarFiltros = () => {
    let resultado = [...vinilos];
    if (filtros.artista) resultado = resultado.filter(v => v.artista === filtros.artista);
    if (filtros.genero) resultado = resultado.filter(v => v.genero === filtros.genero);
    if (filtros.precioMin) resultado = resultado.filter(v => v.precio >= parseFloat(filtros.precioMin));
    if (filtros.precioMax) resultado = resultado.filter(v => v.precio <= parseFloat(filtros.precioMax));
    setFiltrados(resultado);
    setSidebarAbierto(false);
  };

  const limpiarFiltros = () => {
    setFiltros({ artista: '', genero: '', precioMin: '', precioMax: '' });
    setFiltrados(vinilos);
  };

  const añadirAlCarrito = (vinilo) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (!usuario) return alert('Debes iniciar sesión');

  let carrito = usuario.carrito ? JSON.parse(usuario.carrito) : [];
  const existente = carrito.find(v => v.id === vinilo.id);
  if (existente) existente.cantidad += 1;
  else carrito.push({ ...vinilo, cantidad: 1 });

  fetch(`http://localhost:8000/api/usuarios/${usuario.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ carrito: JSON.stringify(carrito) }),
  })
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('usuario', JSON.stringify(data));
      window.location.reload();  // 👈 recarga la página entera
    });
};


  const artistas = vinilos.reduce((acc, v) => {
    acc[v.artista] = (acc[v.artista] || 0) + 1;
    return acc;
  }, {});

  const generos = vinilos.reduce((acc, v) => {
    acc[v.genero] = (acc[v.genero] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="bg-white min-h-screen pt-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">Bienvenido a la tienda de vinilos</h1>
            <p className="text-gray-600 text-lg mt-2">Explora nuestra colección exclusiva de vinilos clásicos y modernos.</p>
          </div>
          <button
            onClick={() => setSidebarAbierto(true)}
            className="bg-black text-white px-4 py-2 rounded-full font-medium hover:bg-[#FFA500] hover:text-black transition"
          >
            Filtrar
          </button>
        </div>

        {sidebarAbierto && (
          <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 p-6 overflow-y-auto border-l-2 border-orange-500 transition-transform duration-300"
               ref={sidebarRef}
          >
            <h3 className="text-xl font-bold text-black mb-4">Filtrar vinilos</h3>

            {/* Artistas */}
            <div className="mb-4">
              <button onClick={() => setMostrarArtistas(!mostrarArtistas)} className="font-medium text-black w-full text-left">
                Artistas
              </button>
              {mostrarArtistas && (
                <ul className="mt-2 space-y-1">
                  {Object.entries(artistas).map(([artista, count]) => (
                    <li key={artista}>
                      <button
                        onClick={() => setFiltros({ ...filtros, artista })}
                        className="text-left w-full px-2 py-1 hover:bg-orange-100 text-black"
                      >
                        {artista} ({count})
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Géneros */}
            <div className="mb-4">
              <button onClick={() => setMostrarGeneros(!mostrarGeneros)} className="font-medium text-black w-full text-left">
                Géneros
              </button>
              {mostrarGeneros && (
                <ul className="mt-2 space-y-1">
                  {Object.entries(generos).map(([genero, count]) => (
                    <li key={genero}>
                      <button
                        onClick={() => setFiltros({ ...filtros, genero })}
                        className="text-left w-full px-2 py-1 hover:bg-orange-100 text-black"
                      >
                        {genero} ({count})
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Precio */}
            <div className="mb-6">
              <label className="block text-black mb-1">Precio mínimo:</label>
              <input
                type="number"
                placeholder="Min ."
                value={filtros.precioMin}
                onChange={(e) => setFiltros({ ...filtros, precioMin: e.target.value })}
                className="w-full p-2 border rounded mb-3 text-black"
              />
              <label className="block text-black mb-1">Precio máximo:</label>
              <input
                type="number"
                placeholder="Max ."
                value={filtros.precioMax}
                onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value })}
                className="w-full p-2 border rounded text-black"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={aplicarFiltros}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Aplicar
              </button>
              <button
                onClick={limpiarFiltros}
                className="text-red-600 hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}

        {filtrados.length === 0 ? (
          <p className="text-gray-500 mt-12">No se encontraron vinilos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
            {filtrados.map((vinilo, i) => (
              <div
                key={vinilo.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out animate-fade-in"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
              >
                <img
                  src={vinilo.imagen}
                  alt={vinilo.titulo}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={() => navigate(`/vinilo/${vinilo.id}`)}
                />
                <div className="p-4">
                  <h2
                    className="text-lg font-bold text-gray-900 cursor-pointer hover:underline"
                    onClick={() => navigate(`/vinilo/${vinilo.id}`)}
                  >
                    {vinilo.titulo}
                  </h2>
                  <p className="text-sm text-gray-500 mb-1">{vinilo.artista} · {vinilo.genero}</p>
                  <p className="text-xl font-semibold text-black">{vinilo.precio} €</p>
                  <button
                    onClick={() => añadirAlCarrito(vinilo)}
                    className="mt-3 w-full py-1.5 px-2 text-sm border-2 border-black bg-black text-white font-medium rounded-md hover:bg-[#FFA500] hover:text-black transition-all flex items-center justify-center gap-2"
                  >
                    <img src="/src/assets/carrito.svg" alt="Carrito" className="w-4 h-4" />
                    Añadir al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-in forwards;
        }
      `}</style>
    </section>
  );
}
