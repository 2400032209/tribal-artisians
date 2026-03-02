import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import './Wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistItems(savedWishlist);
  }, []);

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    alert('Item removed from wishlist');
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    removeFromWishlist(product.id);
    alert(`${product.name} moved to cart!`);
  };

  return (
    <div className="wishlist-page">
      <header className="wishlist-header">
        <Logo />
        <h1>My Wishlist</h1>
      </header>

      <div className="wishlist-container">
        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">❤️</div>
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite items here!</p>
            <button onClick={() => navigate('/customer')} className="continue-shopping">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map(item => (
              <div key={item.id} className="wishlist-card">
                <div className="wishlist-image">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/200x200/8B4513/ffffff?text=Product";
                    }}
                  />
                  <button 
                    className="remove-btn"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    ✕
                  </button>
                </div>
                <div className="wishlist-info">
                  <h3>{item.name}</h3>
                  <p className="artisan">by {item.artisan || 'Tribal Artisan'}</p>
                  <p className="price">₹{item.price}</p>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;