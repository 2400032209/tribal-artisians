import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(savedCart);
  }, []);

  // Update quantity
  const updateQuantity = (itemId, change) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = Math.max(1, (item.quantity || 1) + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Remove item from cart
  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert('Item removed from cart');
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 1000 ? 0 : 50;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  // Go to checkout
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
          <img src="/images/tribal-logo.png" alt="Logo" className="header-logo" />
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
              {cartItems.map(item => (
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
                    ₹{item.price * (item.quantity || 1)}
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