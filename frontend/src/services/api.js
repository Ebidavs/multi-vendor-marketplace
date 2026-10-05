// ===== Checkout / cart API (orders integration) =====
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";
const TOKEN_KEY = "token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    const error = new Error(json?.message || "Request failed");
    error.status = res.status;
    error.errors = json?.errors || [];
    throw error;
  }
  return json.data;
}

export const login = (email, password) =>
  request("/auth/login", { method: "POST", body: { email, password }, auth: false });

export const getProducts = (query = "") => request(`/products${query}`, { auth: false });
export const createOrder = (payload) => request("/orders", { method: "POST", body: payload });

export const getCart = () => request("/cart");
export const clearServerCart = () => request("/cart", { method: "DELETE" });
export const addServerCartItem = (productId, quantity) =>
  request("/cart/items", { method: "POST", body: { productId, quantity } });

export const registerUser = async (userData) => {
  return request("/auth/register", {
    method: "POST",
    body: userData,
    auth: false,
  });
};

export const loginUser = async (userData) => {
  return request("/auth/login", {
    method: "POST",
    body: userData,
    auth: false,
  });
};

export const forgotPassword = (email) =>
  request("/auth/forgot-password", {
    method: "POST",
    body: { email },
    auth: false,
  });
