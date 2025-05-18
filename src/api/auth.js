const API = import.meta.env.VITE_API_URL;

export async function login(email, password) {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) throw new Error('Error al iniciar sesión');
  return await res.json();
}

export async function logout(token) {
  const res = await fetch(`${API}/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Error al cerrar sesión');
  return await res.json();
}

export async function getUser(token) {
  const res = await fetch(`${API}/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('No autenticado');
  return await res.json();
}
