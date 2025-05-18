import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Home() {
  const [vinilos, setVinilos] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';

    const fetchVinilos = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/vinilos${query ? `?search=${encodeURIComponent(query)}` : ''}`);
        const data = await res.json();
        setVinilos(data);
      } catch (error) {
        console.error('Error al cargar vinilos:', error);
      }
    };

    fetchVinilos();
  }, [location]);

  const añadirAlCarrito = (vinilo) => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
      alert('Debes iniciar sesión para añadir al carrito.');
      return;
    }

    let carrito = [];
    try {
      carrito = usuario.carrito ? JSON.parse(usuario.carrito) : [];
    } catch {
      carrito = [];
    }

    const existente = carrito.find((v) => v.id === vinilo.id);
    if (existente) {
      existente.cantidad += 1;
    } else {
      carrito.push({ ...vinilo, cantidad: 1 });
    }

    fetch(`http://localhost:8000/api/usuarios/${usuario.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ carrito: JSON.stringify(carrito) }),
    })
      .then((res) => res.json())
      .then((actualizado) => {
        localStorage.setItem('usuario', JSON.stringify(actualizado));
        alert('Producto añadido al carrito');
      });
  };

  return (
    <section className="bg-white min-h-screen pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-semibold text-gray-800 mb-6">
          Bienvenido a la tienda de vinilos
        </h1>
        <p className="text-gray-600 text-lg mb-12">
          Explora nuestra colección exclusiva de vinilos clásicos y modernos.
        </p>

        {vinilos.length === 0 ? (
          <p className="text-gray-500">No se encontraron vinilos.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {vinilos.map((vinilo, i) => (
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
