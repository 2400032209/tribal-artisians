import React, { createContext, useContext, useEffect, useState } from 'react';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:8080/api/products';

  // GET all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await response.json();

      // Ensure array always
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // POST product
  const addProduct = async (newProduct) => {
    try {
      const productToSend = {
        name: newProduct.name || '',
        category: newProduct.category || '',
        price: Number(newProduct.price) || 0,
        stock: Number(newProduct.stock) || 0,
        description: newProduct.description || '',
        image: newProduct.image || '',
        status: newProduct.status || 'active',
        orders: newProduct.orders || 0,
        artisanId: newProduct.artisanId || 'artisan1'
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productToSend)
      });

      if (!response.ok) {
        throw new Error(`Failed to add product: ${response.status}`);
      }

      const savedProduct = await response.json();

      setProducts((prev) => [...prev, savedProduct]);
      return savedProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  // PATCH product
  const updateProduct = async (id, updatedFields) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedFields)
      });

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.status}`);
      }

      const updatedProduct = await response.json();

      setProducts((prev) =>
        prev.map((product) =>
          String(product.id) === String(id) ? updatedProduct : product
        )
      );

      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  // PUT full update if needed
  const replaceProduct = async (id, productData) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`Failed to replace product: ${response.status}`);
      }

      const updatedProduct = await response.json();

      setProducts((prev) =>
        prev.map((product) =>
          String(product.id) === String(id) ? updatedProduct : product
        )
      );

      return updatedProduct;
    } catch (error) {
      console.error('Error replacing product:', error);
      throw error;
    }
  };

  // DELETE product
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status}`);
      }

      setProducts((prev) =>
        prev.filter((product) => String(product.id) !== String(id))
      );
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        addProduct,
        updateProduct,
        replaceProduct,
        deleteProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};