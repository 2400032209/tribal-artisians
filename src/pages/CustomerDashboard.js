import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import Logo from '../components/Logo';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { getActiveProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);

  // Load products from context
  useEffect(() => {
    setProducts(getActiveProducts());
  }, [getActiveProducts]);

  // Load cart and wishlist from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(savedWishlist);
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = existingCart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    setCart(existingCart);
    alert(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = (product) => {
    const existingWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (!existingWishlist.find(item => item.id === product.id)) {
      existingWishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(existingWishlist));
      setWishlist(existingWishlist);
      alert(`${product.name} added to wishlist!`);
    } else {
      alert('Product already in wishlist!');
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