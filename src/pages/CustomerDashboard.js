import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api';
import Logo from '../components/Logo';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const customerId = user.id;
  const CART_API = 'http://localhost:8080/api/cart';
  const WISHLIST_API = 'http://localhost:8080/api/wishlist';

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();

        const mappedProducts = Array.isArray(data)
          ? data.map((product) => ({
              id: product.id,
              name: product.name,
              category: product.category || '',
              artisan: product.artisan?.name || 'Tribal Artisan',
              rating: product.rating || 4.5,
              price: product.price,
              image: product.imageUrl
            }))
          : [];

        setProducts(mappedProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  const fetchCart = async () => {
    try {
      if (!customerId) {
        setCart([]);
        return;
      }

      const response = await fetch(`${CART_API}/${customerId}`);
      if (!response.ok) throw new Error('Failed to fetch cart');

      const data = await response.json();
      setCart(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart([]);
    }
  };

  const fetchWishlist = async () => {
    try {
      if (!customerId) {
        setWishlist([]);
        return;
      }

      const response = await fetch(`${WISHLIST_API}/${customerId}`);
      if (!response.ok) throw new Error('Failed to fetch wishlist');

      const data = await response.json();
      setWishlist(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchCart();
    fetchWishlist();
  }, [customerId]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = async (product) => {
    try {
      if (!customerId) {
        alert('Please login first');
        return;
      }

      const response = await fetch(`${CART_API}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: customerId,
          productId: product.id,
          quantity: 1
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      await fetchCart();
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      if (!customerId) {
        alert('Please login first');
        return;
      }

      const response = await fetch(`${WISHLIST_API}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: customerId,
          productId: product.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add to wishlist');
      }

      await fetchWishlist();
      alert(`${product.name} added to wishlist!`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      alert('Failed to add to wishlist');
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="customer-dashboard">
      <header className="dashboard-header">
        <Logo />
        
        <div className="header-search">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="header-right">
          <div className="cart-icon" onClick={() => navigate('/cart')}>
            🛒
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </div>
          <div className="wishlist-icon" onClick={() => navigate('/wishlist')}>
            ❤️
            {wishlist.length > 0 && <span className="wishlist-count">{wishlist.length}</span>}
          </div>
          <div className="profile-icon">👤</div>
        </div>
      </header>

      <div className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories">
          <div className="category-item">All</div>
          <div className="category-item">Baskets</div>
          <div className="category-item">Jewelry</div>
          <div className="category-item">Furniture</div>
          <div className="category-item">Textiles</div>
          <div className="category-item">Pottery</div>
        </div>
      </div>

      <div className="products-section">
        <h2>Featured Products</h2>
        {products.length === 0 ? (
          <div className="no-products">
            <p>No products available at the moment.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/300x200/8B4513/ffffff?text=" + product.name;
                    }}
                  />
                  <div className="product-overlay">
                    <button 
                      className="quick-view"
                      onClick={() => handleViewProduct(product.id)}
                    >
                      Quick View
                    </button>
                  </div>
                </div>
                
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="artisan">by {product.artisan}</p>
                  <div className="product-rating">
                    {'★'.repeat(Math.floor(product.rating || 4))}
                    {'☆'.repeat(5 - Math.floor(product.rating || 4))}
                    <span>({product.rating || 4})</span>
                  </div>
                  <p className="product-price">₹{product.price}</p>
                  
                  <div className="product-actions">
                    <button 
                      className="add-to-cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                    <button 
                      className="add-to-wishlist"
                      onClick={() => handleAddToWishlist(product)}
                    >
                      ♥ Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;