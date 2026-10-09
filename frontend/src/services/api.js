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
    body: body !== undefined ? JSON.stringify(body) : undefined,
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

// Compatibility with existing checkout code
export const login = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: {
      email,
      password,
    },
    auth: false,
  });

// ==========================================
// PASSWORD RECOVERY
// ==========================================

export const forgotPassword = async (email) => {
  const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Failed to send reset code");
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

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data?.errors?.map((err) => err.errorMessage || err.message).join(". ") ||
      data?.message ||
      "Password reset failed";

    throw new Error(errorMessage);
  }

  return data;
};

// ==========================================
// ACCOUNT REACTIVATION
// ==========================================

const accountReactivationRequest = async (action, payload) => {
  let response;

  try {
    response = await fetch(`${BASE_URL}/auth/reactivate/${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Unable to connect. Check your internet connection and try again.",
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    const validationErrors = data?.errors
      ?.map((item) => item.errorMessage || item.message)
      .filter(Boolean)
      .join(". ");

    const error = new Error(
      validationErrors ||
        (response.status < 500 && data?.message) ||
        "We couldn't complete your request. Please try again.",
    );

    error.status = response.status;

    throw error;
  }

  return data;
};

export const requestAccountReactivation = (email) =>
  accountReactivationRequest("request", { email });

export const verifyAccountReactivationOtp = ({ email, otp }) =>
  accountReactivationRequest("verify", { email, otp });

export const confirmAccountReactivation = ({ email, otp }) =>
  accountReactivationRequest("confirm", { email, otp });

// ==========================================
// MARKETPLACE PRODUCTS
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

export const getServerCart = () =>
  request("/cart", {
    method: "GET",
  });

export const updateServerCartItem = (
  itemId,
  quantity
) =>
  request(`/cart/items/${itemId}`, {
    method: "PUT",
    body: {
      quantity,
    },
  });

export const removeServerCartItem = (
  itemId
) =>
  request(`/cart/items/${itemId}`, {
    method: "DELETE",
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

export const getVendorCustomerOrders = async (page = 1, limit = 50) => {
  return authenticatedRequest(
    `/api/v1/vendors/orders?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );
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
// ADMIN ANALYTICS
// ==========================================

export const getAdminAnalytics = async () => {
  return authenticatedRequest("/api/v1/admin/analytics", {
    method: "GET",
  });
};

// ==========================================
// ADMIN VENDORS
// ==========================================

export const getAdminVendors = async (page = 1, limit = 50) => {
  return authenticatedRequest(
    `/api/v1/admin/vendors?page=${page}&limit=${limit}`,
    {
      method: "GET",
    },
  );
};

// ==========================================
// ADMIN CUSTOMERS
// ==========================================

export const getAdminCustomers = async (page = 1, limit = 50) => {
  return authenticatedRequest(
    `/api/v1/admin/customers?page=${page}&limit=${limit}`,
    {
      method: "GET",
    },
  );
};

// ==========================================
// ADMIN VENDOR STATUS
// ==========================================

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

// ==========================================
// USER PROFILE
// ==========================================

export const getMyProfile = () =>
  authenticatedRequest("/api/v1/user/me", {
    method: "GET",
  });

export const updateMyProfile = (profileData) =>
  authenticatedRequest("/api/v1/user/update-profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

export const changeMyPassword = (passwordData) =>
  authenticatedRequest("/api/v1/user/change-password", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(passwordData),
  });

export { API_URL, BASE_URL };
