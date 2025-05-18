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
            const detallesFiltrados = detalles.filter((d) => d.pedido_id === pedido.id);
            return { ...pedido, detalles: detallesFiltrados };
          })
        );
        setPedidos(withDetalles);
      });
  }, []);

  const cancelarPedido = async (pedidoId) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:8000/api/pedidos/${pedidoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado: 'Cancelado' }),
    });
    if (res.ok) {
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado: 'Cancelado' } : p))
      );
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Mis Pedidos</h1>
      {pedidos.length === 0 ? (
        <p className="text-gray-600">No tienes pedidos aún.</p>
      ) : (
        pedidos.map((pedido) => (
          <div key={pedido.id} className="mb-6 p-4 bg-white shadow rounded">
            <p><strong>Fecha:</strong> {new Date(pedido.fecha_pedido).toLocaleString()}</p>
            <p><strong>Total:</strong> {pedido.total} €</p>
            <p><strong>Estado:</strong> <span className={`font-semibold ${pedido.estado === 'Cancelado' ? 'text-red-600' : pedido.estado === 'Completado' ? 'text-green-600' : 'text-yellow-600'}`}>{pedido.estado}</span></p>

            {pedido.detalles?.length > 0 && (
              <div className="mt-4">
                <p className="font-medium mb-2">Vinilos en este pedido:</p>
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  {pedido.detalles.map((detalle) => (
                    <li key={detalle.id}>
                      <span className="font-semibold">{detalle.vinilo?.titulo || 'Vinilo'}</span> — {detalle.cantidad} × {detalle.precio_unitario} €
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {pedido.estado !== 'Completado' && pedido.estado !== 'Cancelado' && (
              <button
                onClick={() => cancelarPedido(pedido.id)}
                className="mt-4 text-sm text-red-600 hover:underline"
              >
                Cancelar pedido
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
