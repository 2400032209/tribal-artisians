import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import './Wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const customerId = user.id;
  const WISHLIST_API = 'http://localhost:8080/api/wishlist';
  const CART_API = 'http://localhost:8080/api/cart';

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        if (!customerId) {
          setWishlistItems([]);
          return;
        }

        const response = await fetch(`${WISHLIST_API}/${customerId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch wishlist: ${response.status}`);
        }

        const data = await response.json();

        const mappedItems = Array.isArray(data)
          ? data.map((item) => ({
              id: item.id,
              productId: item.product?.id,
              name: item.product?.name || 'Product',
              image: item.product?.imageUrl || 'https://via.placeholder.com/200x200/8B4513/ffffff?text=Product',
              artisan: item.product?.artisan?.name || 'Tribal Artisan',
              price: item.product?.price || 0
            }))
          : [];

        setWishlistItems(mappedItems);
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
        setWishlistItems([]);
      }
    };

    fetchWishlistItems();
  }, [customerId]);

  const refreshWishlist = async () => {
    try {
      if (!customerId) {
        setWishlistItems([]);
        return;
      }

      const response = await fetch(`${WISHLIST_API}/${customerId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch wishlist: ${response.status}`);
      }

      const data = await response.json();

      const mappedItems = Array.isArray(data)
        ? data.map((item) => ({
            id: item.id,
            productId: item.product?.id,
            name: item.product?.name || 'Product',
            image: item.product?.imageUrl || 'https://via.placeholder.com/200x200/8B4513/ffffff?text=Product',
            artisan: item.product?.artisan?.name || 'Tribal Artisan',
            price: item.product?.price || 0
          }))
        : [];

      setWishlistItems(mappedItems);
    } catch (error) {
      console.error('Error refreshing wishlist items:', error);
      setWishlistItems([]);
    }
  };

  const removeFromWishlist = async (wishlistItemId) => {
    try {
      const response = await fetch(`${WISHLIST_API}/${wishlistItemId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to remove item: ${response.status}`);
      }

      await refreshWishlist();
      alert('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing wishlist item:', error);
      alert('Failed to remove item from wishlist');
    }
  };

  const addToCart = async (item) => {
    try {
      const response = await fetch(`${CART_API}/${customerId}/${item.productId}`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error(`Failed to add to cart: ${response.status}`);
      }

      await removeFromWishlist(item.id);
      alert(`${item.name} moved to cart!`);
    } catch (error) {
      console.error('Error moving item to cart:', error);
      alert('Failed to move item to cart');
    }
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