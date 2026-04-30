const API_BASE_URL = 'http://localhost:8080/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Request failed');
  }

  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
};

// AUTH
export const loginUser = async (loginData) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginData),
  });

  return handleResponse(response);
};

export const registerUser = async (registerData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registerData),
  });

  return handleResponse(response);
};

// PRODUCTS
export const getProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'GET',
  });

  return handleResponse(response);
};

export const getProductById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'GET',
  });

  return handleResponse(response);
};

export const addProduct = async (productData) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  return handleResponse(response);
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  return handleResponse(response);
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });

  return handleResponse(response);
};

// CART
export const getCart = async () => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'GET',
  });

  return handleResponse(response);
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await fetch(`${API_BASE_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  return handleResponse(response);
};

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  const response = await fetch(`${API_BASE_URL}/cart/update/${cartItemId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  });

  return handleResponse(response);
};

export const removeFromCart = async (cartItemId) => {
  const response = await fetch(`${API_BASE_URL}/cart/remove/${cartItemId}`, {
    method: 'DELETE',
  });

  return handleResponse(response);
};

export const clearCart = async () => {
  const response = await fetch(`${API_BASE_URL}/cart/clear`, {
    method: 'DELETE',
  });

  return handleResponse(response);
};

// WISHLIST
export const getWishlist = async () => {
  const response = await fetch(`${API_BASE_URL}/wishlist`, {
    method: 'GET',
  });

  return handleResponse(response);
};

export const addToWishlist = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId }),
  });

  return handleResponse(response);
};

export const removeFromWishlist = async (wishlistItemId) => {
  const response = await fetch(`${API_BASE_URL}/wishlist/remove/${wishlistItemId}`, {
    method: 'DELETE',
  });

  return handleResponse(response);
};

// ORDERS
export const placeOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  return handleResponse(response);
};

export const getOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'GET',
  });

  return handleResponse(response);
};