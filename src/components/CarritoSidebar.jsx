import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function CarritoSidebar({ open, onClose }) {
  const [carrito, setCarrito] = useState([]);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario && usuario.carrito) {
      try {
        setCarrito(JSON.parse(usuario.carrito));
      } catch {
        setCarrito([]);
      }
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  const actualizarCarrito = (nuevo) => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    usuario.carrito = JSON.stringify(nuevo);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    fetch(`http://localhost:8000/api/usuarios/${usuario.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ carrito: usuario.carrito }),
    });
    setCarrito(nuevo);
  };

  const cambiarCantidad = (index, cantidad) => {
    const nuevo = [...carrito];
    nuevo[index].cantidad += cantidad;
    if (nuevo[index].cantidad < 1) nuevo[index].cantidad = 1;
    actualizarCarrito(nuevo);
  };

  const eliminarItem = (index) => {
    const nuevo = carrito.filter((_, i) => i !== index);
    actualizarCarrito(nuevo);
  };

  const subtotal = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  return (
    <div className={`fixed inset-y-0 right-0 w-96 z-50 transition-transform duration-300 transform ${open ? "translate-x-0" : "translate-x-full"}`}>
      <div
        ref={sidebarRef}
        className="h-full bg-white shadow-lg border-l border-orange-500 p-6 overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Tu carrito</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black text-xl">&times;</button>
        </div>

        {carrito.length === 0 ? (
          <p className="text-gray-500">El carrito está vacío.</p>
        ) : (
          <div className="space-y-4">
            {carrito.map((item, index) => (
              <div key={index} className="flex items-center gap-4 border-b pb-3">
                <img src={item.imagen} alt={item.titulo} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.titulo}</p>
                  <p className="text-sm text-gray-600">{item.artista}</p>
                  <p className="text-sm text-black">{item.precio} € × {item.cantidad}</p>
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <button onClick={() => cambiarCantidad(index, 1)} className="px-2 border border-orange-500 rounded text-orange-600">+</button>
                  <button onClick={() => cambiarCantidad(index, -1)} className="px-2 border border-orange-500 rounded text-orange-600">-</button>
                  <button onClick={() => eliminarItem(index)} className="text-red-500 text-sm mt-1">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {carrito.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="text-gray-800 font-medium text-lg">
              Subtotal: <span className="text-black font-bold">{subtotal.toFixed(2)} €</span>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate("/tramitar-pedido");
              }}
              className="w-full bg-orange-500 text-white font-semibold py-2 rounded hover:bg-orange-600"
            >
              Tramitar compra
            </button>
            <button
              onClick={() => actualizarCarrito([])}
              className="text-sm text-red-600 hover:underline"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
