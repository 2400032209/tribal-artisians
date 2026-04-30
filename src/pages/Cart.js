import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const API_URL = 'http://localhost:8080/api/cart';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const customerId = user.id;

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        if (!customerId) {
          setCartItems([]);
          return;
        }

        const response = await fetch(`${API_URL}/${customerId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch cart: ${response.status}`);
        }

        const data = await response.json();

        const mappedItems = Array.isArray(data)
          ? data.map((item) => ({
              id: item.id, // cart item id
              productId: item.product?.id, // actual product id
              name: item.product?.name || 'Product',
              image: item.product?.imageUrl || 'https://via.placeholder.com/120x120?text=Product',
              artisan: item.product?.artisan?.name || 'Tribal Artisan',
              price: item.product?.price || 0,
              quantity: item.quantity || 1
            }))
          : [];

        setCartItems(mappedItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartItems([]);
      }
    };

    fetchCartItems();
  }, [customerId]);

  const refreshCartItems = async () => {
    try {
      if (!customerId) {
        setCartItems([]);
        return;
      }

      const response = await fetch(`${API_URL}/${customerId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch cart: ${response.status}`);
      }

      const data = await response.json();

      const mappedItems = Array.isArray(data)
        ? data.map((item) => ({
            id: item.id, // cart item id
            productId: item.product?.id, // actual product id
            name: item.product?.name || 'Product',
            image: item.product?.imageUrl || 'https://via.placeholder.com/120x120?text=Product',
            artisan: item.product?.artisan?.name || 'Tribal Artisan',
            price: item.product?.price || 0,
            quantity: item.quantity || 1
          }))
        : [];

      setCartItems(mappedItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setCartItems([]);
    }
  };

  const updateQuantity = async (itemId, change) => {
    try {
      const item = cartItems.find((cartItem) => String(cartItem.id) === String(itemId));
      if (!item) return;

      let response;

      if (change > 0) {
        response = await fetch(`${API_URL}/${itemId}/increase`, {
          method: 'PUT'
        });
      } else {
        if ((item.quantity || 1) <= 1) {
          return;
        }

        response = await fetch(`${API_URL}/${itemId}/decrease`, {
          method: 'PUT'
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to update quantity: ${response.status}`);
      }

      await refreshCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/${itemId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to remove item: ${response.status}`);
      }

      await refreshCartItems();
      alert('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + (Number(item.price) * (item.quantity || 1)),
      0
    );
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 1000 ? 0 : 50;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="cart-page">
      <header className="cart-header">
        <div className="header-left" onClick={() => navigate('/')}>
          <img src="/images/logo.png" alt="Tribal Crafts Logo" className="header-logo" />
          <h1>Tribal Crafts</h1>
        </div>
      </header>

      <div className="cart-container">
        <h1>Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <button onClick={() => navigate('/customer')} className="continue-shopping">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="item-image" />

                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-artisan">by {item.artisan || 'Tribal Artisan'}</p>
                    <p className="item-price">₹{item.price}</p>
                  </div>

                  <div className="item-quantity">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>

                  <div className="item-total">
                    ₹{(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                  </div>

                  <div className="item-actions">
                    <button onClick={() => removeItem(item.id)} className="remove-item">
                      ✕ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>{calculateShipping() === 0 ? 'Free' : `₹${calculateShipping()}`}</span>
              </div>

              <div className="summary-row">
                <span>Tax (18% GST)</span>
                <span>₹{calculateTax().toFixed(2)}</span>
              </div>

              <div className="summary-row total">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>

              <button onClick={handleCheckout} className="checkout-btn">
                Proceed to Checkout
              </button>

              <button onClick={() => navigate('/customer')} className="continue-shopping-btn">
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;