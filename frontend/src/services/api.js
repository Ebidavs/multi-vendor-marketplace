// ==========================================
// API CONFIGURATION
// ==========================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://multi-vendor-marketplace-kt9n.onrender.com";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || `${API_URL}/api/v1`;

const TOKEN_KEY = "token";

// ==========================================
// TOKEN HELPERS
// ==========================================

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getAuthToken = getToken;

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// ==========================================
// RESPONSE HANDLER
// ==========================================

const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
};

// ==========================================
// GENERIC API REQUEST
// Used by checkout/cart/customer features
// ==========================================

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  const token = getToken();

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await response.json().catch(() => null);

  if (!response.ok || !json?.success) {
    const error = new Error(json?.message || "Request failed");

    error.status = response.status;
    error.errors = json?.errors || [];

    throw error;
  }

  return json.data;
}

// ==========================================
// AUTHENTICATED REQUEST
// Used by Vendor/Admin dashboard
// Supports JSON and FormData
// ==========================================

export const authenticatedRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
};

// ==========================================
// AUTHENTICATION
// ==========================================

export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.errors?.map((err) => err.errorMessage || err.message).join(". ") ||
      data?.message ||
      "Registration failed";

    throw new Error(errorMessage);
  }

  return data;
};

export const loginUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

// Compatibility with checkout code
export const login = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: {
      email,
      password,
    },
    auth: false,
  });

export const forgotPassword = async (email) => {
  const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to send reset code");
  }

  return data;
};

export const resetPassword = async ({ email, otp, newPassword }) => {
  const response = await fetch(`${BASE_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      otp,
      newPassword,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data.errors?.map((err) => err.errorMessage).join(".") ||
      data.message ||
      "Password reset failed";

    throw new Error(errorMessage);
  }

  return data;
};

// ==========================================
// MARKETPLACE / CUSTOMER PRODUCTS
// ==========================================

export const getProducts = (query = "") =>
  request(`/products${query}`, {
    auth: false,
  });

export const getProductById = async (productId) => {
  const response = await fetch(`${BASE_URL}/products/${productId}`);

  return handleResponse(response);
};

// ==========================================
// CHECKOUT / ORDERS
// ==========================================

export const createOrder = (payload) =>
  request("/orders", {
    method: "POST",
    body: payload,
  });

// ==========================================
// SERVER CART
// ==========================================

export const clearServerCart = () =>
  request("/cart", {
    method: "DELETE",
  });

export const addServerCartItem = (productId, quantity) =>
  request("/cart/items", {
    method: "POST",
    body: {
      productId,
      quantity,
    },
  });

// ==========================================
// CATEGORIES
// ==========================================

export const getCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories`);

  return handleResponse(response);
};

export const createCategory = async (categoryData) => {
  return authenticatedRequest("/api/v1/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });
};

// ==========================================
// VENDOR PRODUCTS
// ==========================================

export const createProduct = async (productData) => {
  return authenticatedRequest("/api/v1/products", {
    method: "POST",
    body: productData,
  });
};

export const updateProduct = async (productId, productData) => {
  return authenticatedRequest(`/api/v1/products/${productId}`, {
    method: "PUT",
    body: productData,
  });
};

export const deleteProduct = async (productId) => {
  return authenticatedRequest(`/api/v1/products/${productId}`, {
    method: "DELETE",
  });
};

export const getVendorProducts = async (vendorId) => {
  const response = await fetch(
    `${BASE_URL}/products?vendor=${vendorId}&limit=50`,
  );

  return handleResponse(response);
};

// ==========================================
// VENDOR ORDERS
// ==========================================

export const getVendorOrders = async () => {
  return authenticatedRequest("/api/v1/vendors/orders?limit=50", {
    method: "GET",
  });
};

export const updateOrderStatus = async (orderId, status) => {
  return authenticatedRequest(`/api/v1/orders/${orderId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });
};

// ==========================================
// VENDOR DASHBOARD
// ==========================================

export const getVendorDashboard = async () => {
  return authenticatedRequest("/api/v1/shops/me/dashboard", {
    method: "GET",
  });
};

// ==========================================
// VENDOR SHOP PROFILE
// ==========================================

export const createShop = async (shopData) => {
  return authenticatedRequest("/api/v1/shops", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shopData),
  });
};

export const updateMyShop = async (shopData) => {
  return authenticatedRequest("/api/v1/shops/me", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shopData),
  });
};

// ==========================================
// ADMIN
// ==========================================

export const getAdminAnalytics = async () => {
  return authenticatedRequest("/api/v1/admin/analytics", {
    method: "GET",
  });
};

export const getAdminVendors = async (page = 1, limit = 50) => {
  return authenticatedRequest(
    `/api/v1/admin/vendors?page=${page}&limit=${limit}`,
    {
      method: "GET",
    },
  );
};

export const getAdminCustomers = async (page = 1, limit = 50) => {
  return authenticatedRequest(
    `/api/v1/admin/customers?page=${page}&limit=${limit}`,
    {
      method: "GET",
    },
  );
};

export const updateVendorStatus = async (vendorId, isActive) => {
  return authenticatedRequest(`/api/v1/admin/vendors/${vendorId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isActive,
    }),
  });
};
// ================================
// USER PROFILE
// ================================

export const getMyProfile = () =>
  authenticatedRequest("/api/v1/users/me", {
    method: "GET",
  });

export const updateMyProfile = (profileData) =>
  authenticatedRequest("/api/v1/users/update-profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

export const changeMyPassword = (passwordData) =>
  authenticatedRequest("/api/v1/users/change-password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(passwordData),
  });

export { API_URL, BASE_URL };
