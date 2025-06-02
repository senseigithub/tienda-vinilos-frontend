import { useEffect, useState } from 'react';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true); // NUEVO estado para saber si está cargando

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    fetch('http://localhost:8000/api/pedidos', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(async (data) => {
        const propios = data.filter((pedido) => pedido.usuario_id === usuario.id);
        const withDetalles = await Promise.all(
          propios.map(async (pedido) => {
            const detallesRes = await fetch(`http://localhost:8000/api/detalles-pedido?pedido_id=${pedido.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const detalles = await detallesRes.json();

            const direccionRes = await fetch(`http://localhost:8000/api/direcciones-envio/${pedido.direccion_envio_id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const direccion = await direccionRes.json();

            const detallesFiltrados = detalles.filter((d) => d.pedido_id === pedido.id);

            return { ...pedido, detalles: detallesFiltrados, direccion };
          })
        );
        setPedidos(withDetalles);
      })
      .finally(() => setCargando(false)); // AL FINAL, desactivamos el cargando
  }, []);

  const actualizarEstadoPedido = async (pedidoId, nuevoEstado) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8000/api/pedidos/${pedidoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    if (res.ok) {
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado: nuevoEstado } : p))
      );
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">🛒 Mis Pedidos</h1>

      {/* ANIMACIÓN DE CARGA */}
      {cargando ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : pedidos.length === 0 ? (
        <p className="text-center text-gray-600">No tienes pedidos aún.</p>
      ) : (
        pedidos.map((pedido) => (
          <div
            key={pedido.id}
            className="mb-8 p-6 bg-white border-2 border-orange-300 rounded-2xl shadow transition-transform hover:scale-[1.01]"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">
                  <span className="font-semibold text-black">Pedido #{pedido.id}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Fecha: {new Date(pedido.fecha_pedido).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Dirección: {pedido.direccion?.direccion}, {pedido.direccion?.ciudad}
                </p>
                <p className="text-sm text-gray-600">
                  Código Postal: {pedido.direccion?.codigo_postal}
                </p>
                <p className="text-sm text-gray-600">
                  Teléfono: {pedido.direccion?.telefono}
                </p>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  pedido.estado === 'Cancelado'
                    ? 'bg-red-100 text-red-600'
                    : pedido.estado === 'Completado'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {pedido.estado}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-black font-medium text-lg">
                Total: {Number(pedido.total).toFixed(2)} €
              </p>
              <p className="text-gray-700">
                Método de pago:{' '}
                <span className="font-semibold capitalize">
                  {pedido.metodo_pago || 'No especificado'}
                </span>
              </p>
            </div>

            {pedido.detalles?.length > 0 && (
              <div className="mt-4">
                <p className="font-medium mb-3 text-gray-800">Detalles del pedido:</p>
                <ul className="space-y-3">
                  {pedido.detalles.map((detalle) => (
                    <li
                      key={detalle.id}
                      className="flex items-center gap-4 text-sm bg-gray-50 p-3 rounded-md shadow-sm"
                    >
                      <img
                        src={detalle.vinilo?.imagen || '/placeholder.png'}
                        alt={detalle.vinilo?.titulo || 'Vinilo'}
                        className="w-14 h-14 object-cover rounded-lg border"
                      />
                      <div>
                        <p className="font-semibold text-black">
                          {detalle.vinilo?.titulo || 'Vinilo'}
                        </p>
                        <p className="text-gray-700">
                          {detalle.cantidad} × {Number(detalle.precio_unitario).toFixed(2)} €
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {pedido.estado !== 'Cancelado' && pedido.estado !== 'Completado' && (
              <div className="mt-5 flex gap-4">
                <button
                  onClick={() => actualizarEstadoPedido(pedido.id, 'Cancelado')}
                  className="px-4 py-2 border-2 border-black bg-red-500 text-white font-semibold rounded-full hover:scale-105 hover:bg-red-600 transition-transform text-sm"
                >
                  Cancelar pedido
                </button>
                <button
                  onClick={() => actualizarEstadoPedido(pedido.id, 'Completado')}
                  className="px-4 py-2 border-2 border-black bg-[#FFA500] text-black font-semibold rounded-full hover:scale-105 hover:bg-[#FF8C00] transition-transform text-sm"
                >
                  Me ha llegado
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
