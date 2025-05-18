import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TramitarPedido() {
  const [carrito, setCarrito] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [nuevaDireccion, setNuevaDireccion] = useState({ direccion: '', ciudad: '', codigo_postal: '', telefono: '' });
  const [usarExistente, setUsarExistente] = useState(true);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [error, setError] = useState(null);
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

  const enviarPedido = async () => {
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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tramitar Pedido</h1>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Dirección de envío</h2>
        {direcciones.length > 0 && (
          <label className="block mb-2">
            <input
              type="radio"
              name="direccion"
              checked={usarExistente}
              onChange={() => setUsarExistente(true)}
            />{' '}
            Usar una dirección guardada
          </label>
        )}
        {direcciones.length > 0 && usarExistente && (
          <select
            className="w-full border p-2 rounded"
            value={direccionSeleccionada}
            onChange={(e) => setDireccionSeleccionada(e.target.value)}
          >
            {direcciones.map((d) => (
              <option key={d.id} value={d.id}>
                {d.direccion}, {d.ciudad}
              </option>
            ))}
          </select>
        )}
        <label className="block mt-4 mb-2">
          <input
            type="radio"
            name="direccion"
            checked={!usarExistente}
            onChange={() => setUsarExistente(false)}
          />{' '}
          Añadir nueva dirección
        </label>
        {!usarExistente && (
          <div className="space-y-2">
            <input
              name="direccion"
              onChange={handleDireccionChange}
              value={nuevaDireccion.direccion}
              placeholder="Dirección"
              className="w-full p-2 border rounded"
            />
            <input
              name="ciudad"
              onChange={handleDireccionChange}
              value={nuevaDireccion.ciudad}
              placeholder="Ciudad"
              className="w-full p-2 border rounded"
            />
            <input
              name="codigo_postal"
              onChange={handleDireccionChange}
              value={nuevaDireccion.codigo_postal}
              placeholder="Código Postal"
              className="w-full p-2 border rounded"
            />
            <input
              name="telefono"
              onChange={handleDireccionChange}
              value={nuevaDireccion.telefono}
              placeholder="Teléfono"
              className="w-full p-2 border rounded"
            />
          </div>
        )}
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Resumen del pedido</h2>
        {carrito.length === 0 ? (
          <p className="text-gray-600">Tu carrito está vacío.</p>
        ) : (
          <ul className="space-y-2">
            {carrito.map((item, i) => (
              <li key={i} className="text-sm">
                {item.titulo} × {item.cantidad} — {item.precio * item.cantidad} €
              </li>
            ))}
          </ul>
        )}
      </div>

      {carrito.length > 0 && (
        <button
          onClick={enviarPedido}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Confirmar pedido
        </button>
      )}
    </div>
  );
}
