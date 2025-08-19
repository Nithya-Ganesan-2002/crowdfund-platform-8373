const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

/**
 * Simple wrapper for API requests
 * Automatically attaches Authorization header if token exists in localStorage
 */
async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const token = localStorage.getItem('token');

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  // Try to parse JSON if content-type allows
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await res.json().catch(() => ({})) : null;

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || res.statusText || 'Request failed';
    throw new Error(message);
  }

  return data;
}

// PUBLIC_INTERFACE
export function setToken(token) {
  /** Saves JWT token into localStorage for subsequent authenticated requests */
  localStorage.setItem('token', token);
}

// PUBLIC_INTERFACE
export function clearToken() {
  /** Clears JWT from localStorage to logout */
  localStorage.removeItem('token');
}

// Auth
// PUBLIC_INTERFACE
export function registerUser(payload) {
  /** Register a new user: { name, email, password } -> { token?, user? } */
  return request('/auth/register', { method: 'POST', body: payload });
}

// PUBLIC_INTERFACE
export function loginUser(payload) {
  /** Login user: { email, password } -> { token, user } */
  return request('/auth/login', { method: 'POST', body: payload });
}

// PUBLIC_INTERFACE
export function getMe() {
  /** Get current authenticated user info */
  return request('/auth/me');
}

// Projects
// PUBLIC_INTERFACE
export function listProjects(params = {}) {
  /** List projects with filters: { q, category, owner_id, limit, offset } */
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  ).toString();
  const suffix = query ? `?${query}` : '';
  return request(`/projects${suffix}`);
}

// PUBLIC_INTERFACE
export function getProject(id) {
  /** Get a single project by ID */
  return request(`/projects/${id}`);
}

// PUBLIC_INTERFACE
export function createProject(payload) {
  /** Create a new project (auth required): { title, description, goal_amount, deadline?, category? } */
  return request('/projects', { method: 'POST', body: payload });
}

// Pledges / Stripe
// PUBLIC_INTERFACE
export function createPaymentIntent({ project_id, amount, currency = 'usd' }) {
  /** Create a Stripe PaymentIntent (auth required) */
  return request('/pledges/create-intent', {
    method: 'POST',
    body: { project_id, amount, currency },
  });
}

// PUBLIC_INTERFACE
export function confirmPaymentIntent(payment_intent_id) {
  /** Confirm an existing payment intent (server-side confirmation) */
  return request('/pledges/confirm', { method: 'POST', body: { payment_intent_id } });
}

// PUBLIC_INTERFACE
export function listPledgesForProject(project_id) {
  /** List pledges for a given project */
  return request(`/pledges/project/${project_id}`);
}
