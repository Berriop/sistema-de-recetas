const API_BASE_URL = 'http://localhost:8081';

/**
 * Wrapper de fetch centralizado.
 * Lanza un Error con el mensaje del backend si la respuesta no es 2xx.
 */
export const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = { ...options, headers };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Intentar parsear siempre como JSON
  let data = null;
  try {
    data = await response.json();
  } catch (_) {
    data = null;
  }

  if (!response.ok) {
    // El backend devuelve { error: "..." } o strings planos
    const msg =
      (data && (data.error || data.message)) ||
      (typeof data === 'string' ? data : null) ||
      `Error ${response.status}`;
    throw new Error(msg);
  }

  return data;
};
