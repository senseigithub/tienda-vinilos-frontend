// Pedidos mejorado: muestra dirección, método de pago, botones condicionales y fondo blanco
import { useEffect, useState } from 'react';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8000/api/pedidos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(async (data) => {
        const withDetalles = await Promise.all(
          data.map(async (pedido) => {
            const detallesRes = await fetch(`http://localhost:8000/api/detalles-pedido?pedido_id=${pedido.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const detalles = await detallesRes.json();
            const direccionRes = await fetch(`http://localhost:8000/api/direcciones-envio/${pedido.direccion_envio_id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const direccion = await direccionRes.json();
            const detallesFiltrados = detalles.filter((d) => d.pedido_id === pedido.id);
            return { ...pedido, detalles: detallesFiltrados, direccion };
          })
        );
        setPedidos(withDetalles);
      });
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
    <div className="min-h-screen bg-white p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-black">Mis Pedidos</h1>
      {pedidos.length === 0 ? (
        <p className="text-gray-600">No tienes pedidos aún.</p>
      ) : (
        pedidos.map((pedido) => (
          <div key={pedido.id} className="mb-6 p-5 bg-white border rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm text-gray-500">Pedido #{pedido.id}</p>
                <p className="text-sm text-gray-500">Fecha: {new Date(pedido.fecha_pedido).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Dirección: {pedido.direccion?.direccion}, {pedido.direccion?.ciudad}</p>
                <p className="text-sm text-gray-500">Código Postal: {pedido.direccion?.codigo_postal}</p>
                <p className="text-sm text-gray-500">Teléfono: {pedido.direccion?.telefono}</p>
              </div>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${pedido.estado === 'Cancelado' ? 'bg-red-100 text-red-600' : pedido.estado === 'Completado' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-700'}`}>
                {pedido.estado}
              </span>
            </div>
            <p className="text-black font-medium">Total: {Number(pedido.total).toFixed(2)} €</p>
            <p className="text-black">Método de pago: <span className="font-semibold capitalize">{pedido.metodo_pago || 'No especificado'}</span></p>

            {pedido.detalles?.length > 0 && (
              <div className="mt-4">
                <p className="font-medium mb-2 text-gray-700">Vinilos:</p>
                <ul className="space-y-3">
                  {pedido.detalles.map((detalle) => (
                    <li key={detalle.id} className="flex items-center gap-4 text-sm text-gray-700">
                      <img src={detalle.vinilo?.imagen || '/placeholder.png'} alt={detalle.vinilo?.titulo || 'Vinilo'} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <p className="font-semibold">{detalle.vinilo?.titulo || 'Vinilo'}</p>
                        <p>{detalle.cantidad} × {Number(detalle.precio_unitario).toFixed(2)} €</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {pedido.estado !== 'Cancelado' && pedido.estado !== 'Completado' && (
              <div className="mt-4 space-x-4">
                <button
                  onClick={() => actualizarEstadoPedido(pedido.id, 'Cancelado')}
                  className="text-sm text-red-600 hover:underline"
                >
                  Cancelar pedido
                </button>
                <button
                  onClick={() => actualizarEstadoPedido(pedido.id, 'Completado')}
                  className="text-sm text-green-600 hover:underline"
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
