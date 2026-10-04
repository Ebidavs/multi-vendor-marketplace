const API_URL =
  "https://multi-vendor-marketplace-kt9n.onrender.com";

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
};

export const registerUser = async (userData) => {
  const response = await fetch(
    `${API_URL}/api/v1/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );

  return handleResponse(response);
};

export const loginUser = async (userData) => {
  const response = await fetch(
    `${API_URL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );

  return handleResponse(response);
};

export const forgotPassword = async (email) => {
  const response = await fetch(
    `${API_URL}/api/v1/auth/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    }
  );

  return handleResponse(response);
};

export const getAuthToken = () => {
  return localStorage.getItem("token");
};

export const authenticatedRequest = async (
  endpoint,
  options = {}
) => {
  const token = getAuthToken();

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  return handleResponse(response);
};

export const getCategories = async () => {
  const response = await fetch(
    `${API_URL}/api/v1/categories`
  );

  return handleResponse(response);
};

export const createProduct = async (productData) => {
  return authenticatedRequest(
    "/api/v1/products",
    {
      method: "POST",
      body: productData,
    }
  );
};

export const updateProduct = async (
  productId,
  productData
) => {
  return authenticatedRequest(
    `/api/v1/products/${productId}`,
    {
      method: "PUT",
      body: productData,
    }
  );
};

export const deleteProduct = async (productId) => {
  return authenticatedRequest(
    `/api/v1/products/${productId}`,
    {
      method: "DELETE",
    }
  );
};
export const getVendorProducts = async (
  vendorId
) => {
  const response = await fetch(
    `${API_URL}/api/v1/products?vendor=${vendorId}&limit=50`
  );

  return handleResponse(response);
};

export const getProductById = async (
  productId
) => {
  const response = await fetch(
    `${API_URL}/api/v1/products/${productId}`
  );

  return handleResponse(response);
};
export const getVendorOrders = async () => {
  return authenticatedRequest(
    "/api/v1/vendors/orders?limit=50",
    {
      method: "GET",
    }
  );
};

export const updateOrderStatus = async (
  orderId,
  status
) => {
  return authenticatedRequest(
    `/api/v1/orders/${orderId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    }
  );
};
export const getVendorDashboard = async () => {
  return authenticatedRequest(
    "/api/v1/shops/me/dashboard",
    {
      method: "GET",
    }
  );
};
export const createShop = async (shopData) => {
  return authenticatedRequest(
    "/api/v1/shops",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shopData),
    }
  );
};

export const updateMyShop = async (shopData) => {
  return authenticatedRequest(
    "/api/v1/shops/me",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shopData),
    }
  );
};
export const getAdminAnalytics = async () => {
  return authenticatedRequest(
    "/api/v1/admin/analytics",
    {
      method: "GET",
    }
  );
};
export const getAdminVendors = async () => {
  return authenticatedRequest(
    "/api/v1/admin/vendors?limit=50",
    {
      method: "GET",
    }
  );
};

export const updateVendorStatus = async (
  vendorId,
  isActive
) => {
  return authenticatedRequest(
    `/api/v1/admin/vendors/${vendorId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isActive,
      }),
    }
  );
};
export { API_URL };