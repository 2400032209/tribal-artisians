import React, { createContext, useState, useContext, useEffect } from 'react';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products from localStorage on initial load
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    if (savedProducts.length === 0) {
      // Default products if none exist
      const defaultProducts = [
        {
          id: 1,
          name: "Wooden Basket",
          price: 899,
          rating: 4.5,
          image: "/images/wooden-basket.png",
          category: "Baskets",
          description: "Traditional handwoven basket made from sustainable wood",
          artisan: "Lakshmi's Crafts",
          artisanId: "artisan1",
          stock: 15,
          status: "active",
          orders: 23
        },
        {
          id: 2,
          name: "Tribal Earrings Set",
          price: 399,
          rating: 4.8,
          image: "/images/tribal-earrings.png",
          category: "Jewelry",
          description: "Authentic tribal earrings with traditional designs",
          artisan: "Tribal Heritage",
          artisanId: "artisan2",
          stock: 50,
          status: "active",
          orders: 45
        },
        {
          id: 3,
          name: "Bamboo Chair",
          price: 2499,
          rating: 4.7,
          image: "/images/bamboo-chair.png",
          category: "Furniture",
          description: "Handcrafted bamboo chair, eco-friendly and durable",
          artisan: "Green Crafts",
          artisanId: "artisan1",
          stock: 8,
          status: "active",
          orders: 12
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('products', JSON.stringify(defaultProducts));
    } else {
      setProducts(savedProducts);
    }
    setLoading(false);
  }, []);

  // Add a new product
  const addProduct = (newProduct) => {
    const product = {
      ...newProduct,
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      rating: 4.0,
      orders: 0,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    return product;
  };

  // Update an existing product
  const updateProduct = (productId, updatedData) => {
    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, ...updatedData } : p
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  // Delete a product
  const deleteProduct = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  // Get active products only (for customer view)
  const getActiveProducts = () => {
    return products.filter(p => p.status === 'active');
  };

  // Get product by ID
  const getProductById = (productId) => {
    return products.find(p => p.id === parseInt(productId));
  };

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      getActiveProducts,
      getProductById
    }}>
      {children}
    </ProductContext.Provider>
  );
};