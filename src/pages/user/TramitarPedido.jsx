import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TramitarPedido() {
  const [carrito, setCarrito] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [nuevaDireccion, setNuevaDireccion] = useState({ direccion: '', ciudad: '', codigo_postal: '', telefono: '' });
  const [usarExistente, setUsarExistente] = useState(true);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [error, setError] = useState(null);
  const [metodoPago, setMetodoPago] = useState('paypal');
  const [tarjeta, setTarjeta] = useState({ numero: '', titular: '', vencimiento: '', cvv: '' });
  const [pagoError, setPagoError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario || !usuario.carrito) return;
    try {
      setCarrito(JSON.parse(usuario.carrito));
    } catch {
      setCarrito([]);
    }

    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/direcciones-envio', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setDirecciones(data);
        if (data.length > 0) setDireccionSeleccionada(data[0].id);
      });
  }, []);

  const handleDireccionChange = (e) => {
    setNuevaDireccion({ ...nuevaDireccion, [e.target.name]: e.target.value });
  };

  const handleTarjetaChange = (e) => {
    setTarjeta({ ...tarjeta, [e.target.name]: e.target.value });
  };

  const quitarProducto = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    actualizarCarrito(nuevoCarrito);
  };

  const cambiarCantidad = (index, cantidad) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito[index].cantidad = Math.max(1, nuevoCarrito[index].cantidad + cantidad);
    actualizarCarrito(nuevoCarrito);
  };

  const actualizarCarrito = (nuevoCarrito) => {
    setCarrito(nuevoCarrito);
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    usuario.carrito = JSON.stringify(nuevoCarrito);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  };

  const enviarPedido = async () => {
    setError(null);
    setPagoError(null);

    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    let direccionEnvioId = direccionSeleccionada;

    if (!usarExistente) {
      if (!nuevaDireccion.direccion || !nuevaDireccion.ciudad || !nuevaDireccion.codigo_postal || !nuevaDireccion.telefono) {
        return setError('Por favor completa todos los campos de la dirección.');
      }

      const res = await fetch('http://localhost:8000/api/direcciones-envio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...nuevaDireccion, usuario_id: usuario.id }),
      });
      const nueva = await res.json();
      direccionEnvioId = nueva.id;
    }

    if (metodoPago === 'tarjeta') {
      if (!tarjeta.numero || !tarjeta.titular || !tarjeta.vencimiento || !tarjeta.cvv) {
        return setPagoError('Por favor completa todos los campos de la tarjeta.');
      }
    }

    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    const pedidoRes = await fetch('http://localhost:8000/api/pedidos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        usuario_id: usuario.id,
        direccion_envio_id: direccionEnvioId,
        fecha_pedido: new Date().toISOString(),
        estado: 'Pendiente',
        total,
      }),
    });

    const pedido = await pedidoRes.json();

    for (const item of carrito) {
      await fetch('http://localhost:8000/api/detalles-pedido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pedido_id: pedido.id,
          vinilo_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
        }),
      });
    }

    await fetch(`http://localhost:8000/api/usuarios/${usuario.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ carrito: null }),
    });

    usuario.carrito = null;
    localStorage.setItem('usuario', JSON.stringify(usuario));
    setCarrito([]);
    alert('Pedido realizado con éxito');
    navigate('/pedidos');
  };

  const subtotal = carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0).toFixed(2);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg border shadow">
          <h2 className="text-xl font-bold mb-4 text-black">Productos en tu carrito</h2>
          {carrito.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-4 border-b">
              <div className="flex items-center gap-4">
                <img src={item.imagen || '/placeholder.png'} alt={item.titulo} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="font-medium text-black">{item.titulo}</p>
                  <p className="text-sm text-gray-600">Cantidad: {item.cantidad}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-black font-semibold">{(item.precio * item.cantidad).toFixed(2)} €</p>
                <div className="flex gap-2">
                  <button onClick={() => cambiarCantidad(index, -1)} className="px-2 py-1 bg-gray-200 rounded hover:bg-orange-200 transition">-</button>
                  <button onClick={() => cambiarCantidad(index, 1)} className="px-2 py-1 bg-gray-200 rounded hover:bg-orange-200 transition">+</button>
                  <button onClick={() => quitarProducto(index)} className="text-red-500 hover:text-red-700">🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg border shadow space-y-6">
          <h2 className="text-xl font-bold text-black">Dirección y pago</h2>

          <div>
            <label className="block mb-2 text-black">
              <input type="radio" name="direccion" checked={usarExistente} onChange={() => setUsarExistente(true)} className="mr-2" />
              Usar dirección guardada
            </label>
            {usarExistente && (
              <select className="w-full border p-2 rounded text-black bg-white" value={direccionSeleccionada} onChange={(e) => setDireccionSeleccionada(e.target.value)}>
                {direcciones.map((d) => (
                  <option key={d.id} value={d.id}>{d.direccion}, {d.ciudad}</option>
                ))}
              </select>
            )}
            <label className="block mt-4 mb-2 text-black">
              <input type="radio" name="direccion" checked={!usarExistente} onChange={() => setUsarExistente(false)} className="mr-2" />
              Añadir nueva dirección
            </label>
            {!usarExistente && (
              <div className="grid grid-cols-1 gap-3 mt-2">
                {['direccion', 'ciudad', 'codigo_postal', 'telefono'].map((field) => (
                  <input key={field} name={field} onChange={handleDireccionChange} value={nuevaDireccion[field]} placeholder={field.replace('_', ' ').toUpperCase()} className="w-full p-2 border border-gray-300 rounded text-black bg-white" />
                ))}
              </div>
            )}
            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-black mb-2">Método de pago</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="pago" value="paypal" checked={metodoPago === 'paypal'} onChange={(e) => setMetodoPago(e.target.value)} />
                <img src="/src/assets/paypal-icon.svg" alt="PayPal" className="w-6 h-6" /> PayPal
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="pago" value="tarjeta" checked={metodoPago === 'tarjeta'} onChange={(e) => setMetodoPago(e.target.value)} />
                <img src="/src/assets/tarjeta-credito-icon.svg" alt="Tarjeta" className="w-6 h-6" /> Tarjeta de crédito
              </label>
            </div>

            {metodoPago === 'tarjeta' && (
              <div className="grid grid-cols-1 gap-3 mt-4">
                <input name="numero" value={tarjeta.numero} onChange={handleTarjetaChange} placeholder="Número de tarjeta" className="w-full p-2 border border-gray-300 rounded text-black bg-white" />
                <input name="titular" value={tarjeta.titular} onChange={handleTarjetaChange} placeholder="Nombre del titular" className="w-full p-2 border border-gray-300 rounded text-black bg-white" />
                <input name="vencimiento" value={tarjeta.vencimiento} onChange={handleTarjetaChange} placeholder="Fecha de vencimiento (MM/AA)" className="w-full p-2 border border-gray-300 rounded text-black bg-white" />
                <input name="cvv" value={tarjeta.cvv} onChange={handleTarjetaChange} placeholder="CVV" className="w-full p-2 border border-gray-300 rounded text-black bg-white" />
              </div>
            )}
            {pagoError && <p className="text-sm text-red-500 mt-3">{pagoError}</p>}
          </div>

          <div className="text-black space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span>Total productos:</span>
              <span>{subtotal} €</span>
            </div>
            <div className="flex justify-between">
              <span>Envío:</span>
              <span>Gratis</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total:</span>
              <span>{subtotal} €</span>
            </div>
          </div>

          <button onClick={enviarPedido} className="w-full bg-black text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:bg-orange-500 hover:text-black shadow-sm">
            Confirmar pedido
          </button>
        </div>
      </div>
    </div>
  );
}
