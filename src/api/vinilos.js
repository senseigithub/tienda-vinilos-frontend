const API = import.meta.env.VITE_API_URL;

export async function getVinilos(busqueda = '') {
  const url = busqueda
    ? `${API}/vinilos?busqueda=${encodeURIComponent(busqueda)}`
    : `${API}/vinilos`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al cargar vinilos');
  return await res.json();
}

export async function getViniloById(id) {
  const res = await fetch(`${API}/vinilos/${id}`);
  if (!res.ok) throw new Error('Vinilo no encontrado');
  return await res.json();
}

export async function createVinilo(data, token) {
  const res = await fetch(`${API}/vinilos`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al crear vinilo');
  return await res.json();
}

export async function updateVinilo(id, data, token) {
  const res = await fetch(`${API}/vinilos/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error al actualizar vinilo');
  return await res.json();
}

export async function deleteVinilo(id, token) {
  const res = await fetch(`${API}/vinilos/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Error al eliminar vinilo');
  return await res.json();
}
