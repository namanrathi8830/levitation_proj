const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// Auth API calls
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Products API calls
export const productsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (productData: {
    name: string;
    price: number;
    quantity: number;
  }) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  update: async (
    id: string,
    productData: { name: string; price: number; quantity: number },
  ) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  deleteAll: async () => {
    const response = await fetch(`${API_BASE_URL}/products/clear`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Invoices API calls
export const invoicesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/invoices`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  generate: async (data: {
    customerName?: string;
    customerEmail?: string;
    productIds?: string[];
  }) => {
    const response = await fetch(`${API_BASE_URL}/invoices/generate`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  generatePDF: async (data: {
    customerName?: string;
    customerEmail?: string;
    productIds?: string[];
  }) => {
    const response = await fetch(`${API_BASE_URL}/invoices/generate-pdf`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to generate PDF");
    }

    return response.blob();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/invoices/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
  },
};
