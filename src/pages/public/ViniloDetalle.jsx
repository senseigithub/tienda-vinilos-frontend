import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ViniloDetalle() {
  const { id } = useParams();
  const [vinilo, setVinilo] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [valoraciones, setValoraciones] = useState([]);
  const [comentario, setComentario] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [comentarioEditado, setComentarioEditado] = useState("");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [indiceImagen, setIndiceImagen] = useState(0);
  const [mostrarDescripcionCompleta, setMostrarDescripcionCompleta] = useState(false);

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const usuarioId = usuario?.id;
  const isAdmin = usuario?.rol === "admin";

  useEffect(() => {
    fetch(`http://localhost:8000/api/vinilos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("No encontrado");
        return res.json();
      })
      .then((data) => {
        setVinilo({
          ...data,
          imagenes: data.imagenes || [data.imagen],
        });
      })
      .catch((err) => {
        console.error("Error al cargar vinilo:", err);
        alert("No se pudo cargar el vinilo.");
      });
  }, [id]);

  useEffect(() => {
    if (vinilo?.id) {
      fetch(`http://localhost:8000/api/valoraciones?vinilo_id=${vinilo.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const filtradas = data.filter((v) => v.vinilo_id === vinilo.id);
          setValoraciones(filtradas);
        })
        .catch(() => setValoraciones([]));
    }
  }, [vinilo]);

  const añadirAlCarrito = () => {
    if (!usuario) {
      alert("Debes iniciar sesión para añadir al carrito.");
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
      existente.cantidad += cantidad;
    } else {
      carrito.push({ ...vinilo, cantidad });
    }
    fetch(`http://localhost:8000/api/usuarios/${usuario.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ carrito: JSON.stringify(carrito) }),
    })
      .then((res) => res.json())
      .then((actualizado) => {
        localStorage.setItem("usuario", JSON.stringify(actualizado));
        window.location.reload();
      });
  };

  const enviarComentario = async () => {
    if (!usuario) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }
    if (!comentario.trim()) return alert("Comentario vacío");
    const nuevaValoracion = {
      usuario_id: usuario.id,
      vinilo_id: vinilo.id,
      comentario,
      fecha_valoracion: new Date().toISOString(),
    };
    const res = await fetch("http://localhost:8000/api/valoraciones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(nuevaValoracion),
    });
    if (res.ok) {
      const nueva = await res.json();
      setValoraciones([...valoraciones, nueva]);
      setComentario("");
    } else {
      alert("Error al enviar el comentario.");
    }
  };

  const eliminarComentario = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este comentario?")) return;
    const res = await fetch(`http://localhost:8000/api/valoraciones/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) {
      setValoraciones(valoraciones.filter((v) => v.id !== id));
    } else {
      alert("No se pudo eliminar el comentario.");
    }
  };

  const guardarEdicion = async (id) => {
    if (!comentarioEditado.trim()) {
      alert("Comentario vacío");
      return;
    }
    const res = await fetch(`http://localhost:8000/api/valoraciones/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ comentario: comentarioEditado }),
    });
    const data = await res.json();
    if (res.ok) {
      setValoraciones((prev) => prev.map((v) => (v.id === id ? data : v)));
      setEditandoId(null);
      setComentarioEditado("");
    } else {
      alert(data.error || "No se pudo guardar el cambio");
    }
  };

  if (!vinilo) return <div className="p-8 text-gray-600">Cargando vinilo...</div>;

  return (
    <div className="min-h-screen bg-white pt-24 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Imagen principal */}
        <div className="w-full md:w-1/2">
          <img
            src={vinilo.imagenes[indiceImagen]}
            alt={vinilo.titulo}
            className="w-full h-[550px] object-contain rounded-xl shadow-lg cursor-pointer"
            onClick={() => setModalAbierto(true)}
          />
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{vinilo.titulo}</h1>
          <p className="text-xl text-gray-600">
            {vinilo.artista} · {vinilo.genero}
          </p>
          <p className="text-2xl font-semibold text-black">{vinilo.precio} €</p>
          <p className="text-gray-500">Stock disponible: {vinilo.stock}</p>

          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-700">Cantidad:</label>
            <div className="flex border rounded-md overflow-hidden">
              <button
                className="px-3 bg-gray-200 text-black hover:bg-gray-300"
                onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
              >
                −
              </button>
              <span className="px-4 py-1 bg-white text-black">{cantidad}</span>
              <button
                className="px-3 bg-gray-200 text-black hover:bg-gray-300"
                onClick={() => setCantidad((prev) => prev + 1)}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={añadirAlCarrito}
            className="mt-6 px-6 py-2 border-2 border-black bg-black text-white font-medium rounded-md hover:bg-[#FFA500] hover:text-black transition-all flex items-center justify-center gap-2"
          >
            <img src="/src/assets/carrito.svg" alt="Carrito" className="w-4 h-4" />
            Agregar al carrito
          </button>

          {vinilo.descripcion && (
            <div className="mt-6 text-gray-700 leading-relaxed">
              <p className={`${!mostrarDescripcionCompleta ? 'line-clamp-[8]' : ''}`}>
                {vinilo.descripcion}
              </p>
              {vinilo.descripcion.length > 400 && (
                <button
                  onClick={() => setMostrarDescripcionCompleta(!mostrarDescripcionCompleta)}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  {mostrarDescripcionCompleta ? "Ver menos" : "Ver más"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal carrusel */}
      {modalAbierto && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeZoom"
          onClick={() => setModalAbierto(false)}
        >
          <div className="relative max-w-4xl w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold"
              onClick={() => setModalAbierto(false)}
            >
              ✕
            </button>
            {vinilo.imagenes.length > 1 && (
              <>
                <button
                  className="absolute left-2 text-white text-4xl font-bold"
                  onClick={() =>
                    setIndiceImagen((prev) =>
                      prev === 0 ? vinilo.imagenes.length - 1 : prev - 1
                    )
                  }
                >
                  ‹
                </button>
                <button
                  className="absolute right-2 text-white text-4xl font-bold"
                  onClick={() =>
                    setIndiceImagen((prev) =>
                      prev === vinilo.imagenes.length - 1 ? 0 : prev + 1
                    )
                  }
                >
                  ›
                </button>
              </>
            )}
            <img
              src={vinilo.imagenes[indiceImagen]}
              alt={`Imagen ${indiceImagen + 1}`}
              className="max-h-[90vh] w-auto rounded shadow-xl object-contain"
            />
          </div>
        </div>
      )}

      {/* Animación CSS */}
      <style>{`
        @keyframes fadeZoom {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeZoom {
          animation: fadeZoom 0.3s ease-out forwards;
        }
      `}</style>

      {/* Comentarios */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comentarios</h2>
        <div className="mb-8">
          {valoraciones.length === 0 ? (
            <p className="text-gray-500">Aún no hay comentarios.</p>
          ) : (
            <ul className="space-y-6">
              {valoraciones.map((val) => {
                const puedeGestionar = val.usuario_id === usuarioId || isAdmin;
                return (
                  <li key={val.id} className="bg-white p-4 rounded-xl shadow border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm text-gray-500">
                        <strong>{val.usuario?.nombre || "Usuario"}:</strong>{" "}
                        {new Date(val.fecha_valoracion).toLocaleDateString()}
                      </p>
                      {puedeGestionar && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditandoId(val.id);
                              setComentarioEditado(val.comentario);
                            }}
                            className="px-3 py-1 text-sm font-medium text-black border border-black rounded-full bg-[#FFA500] hover:bg-orange-300 transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarComentario(val.id)}
                            className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                    {editandoId === val.id ? (
                      <div className="mt-2">
                        <textarea
                          className="w-full border rounded p-2 mb-2 text-black"
                          rows={3}
                          value={comentarioEditado}
                          onChange={(e) => setComentarioEditado(e.target.value)}
                        />
                        <button
                          onClick={() => guardarEdicion(val.id)}
                          className="px-4 py-1 text-sm bg-[#FFA500] text-black font-medium border border-black rounded hover:bg-[#FF8C00] transition"
                        >
                          Guardar
                        </button>
                      </div>
                    ) : (
                      <p className="text-gray-800">{val.comentario}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="p-4 border rounded shadow bg-white">
          <h3 className="text-lg text-black font-semibold mb-2">
            Escribe tu comentario
          </h3>
          <textarea
            rows={3}
            className="w-full border rounded p-2 mb-2 text-black"
            placeholder="¿Qué te pareció este vinilo?"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
          <button
            onClick={enviarComentario}
            className="px-4 py-2 bg-[#FFA500] text-black font-medium border-2 border-black rounded hover:bg-[#FF8C00] transition"
          >
            Enviar comentario
          </button>
        </div>
      </div>
    </div>
  );
}
