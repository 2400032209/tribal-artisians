import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(savedWishlist);
  }, []);

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Handwoven Wooden Basket",
      price: 899,
      rating: 4.5,
      image: "/images/wooden-basket.png",
      category: "Baskets",
      description: "Traditional handwoven basket made from sustainable wood",
      artisan: "Lakshmi's Crafts"
    },
    {
      id: 2,
      name: "Tribal Earrings Set",
      price: 399,
      rating: 4.8,
      image: "/images/tribal-earrings.png",
      category: "Jewelry",
      description: "Authentic tribal earrings with traditional designs",
      artisan: "Tribal Heritage"
    },
    {
      id: 3,
      name: "Bamboo Chair",
      price: 2499,
      rating: 4.7,
      image: "/images/bamboo-chair.png",
      category: "Furniture",
      description: "Handcrafted bamboo chair, eco-friendly and durable",
      artisan: "Green Crafts"
    },
    {
      id: 4,
      name: "Handmade Cotton Towel",
      price: 299,
      rating: 4.3,
      image: "/images/cotton-towel.png",
      category: "Textiles",
      description: "Soft, handwoven cotton towel with tribal patterns",
      artisan: "Weavers of India"
    },
    {
      id: 5,
      name: "Terracotta Pottery Set",
      price: 599,
      rating: 4.6,
      image: "/images/pottery.png",
      category: "Pottery",
      description: "Traditional terracotta pots for home decor",
      artisan: "Clay Stories"
    }
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product) => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already exists in cart
    const existingItem = existingCart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }
    
    // Save back to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Update cart count in header
    setCart(existingCart);
    
    // Show success message
    alert(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = (product) => {
    // Get existing wishlist from localStorage
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

  // Function to handle image errors
  const handleImageError = (e, productName) => {
    console.log(`Image failed to load: ${productName}`);
    e.target.onerror = null;
    // Create a colored placeholder
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Background color
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(productName, 150, 100);
    
    e.target.src = canvas.toDataURL();
  };

  return (
    <div className="customer-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left" onClick={() => navigate('/')}>
          <img 
            src="/images/logo.png" 
            alt="Tribal Crafts Logo" 
            className="header-logo"
            onError={(e) => {
              e.target.onerror = null;
              // If logo fails, create a text logo
              const parent = e.target.parentNode;
              const textLogo = document.createElement('div');
              textLogo.className = 'text-logo';
              textLogo.innerHTML = '🪵 TC';
              parent.insertBefore(textLogo, e.target);
              e.target.style.display = 'none';
            }}
          />
          <h1>Tribal Crafts</h1>
        </div>
        
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

      {/* Categories */}
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

      {/* Products Grid */}
      <div className="products-section">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img 
                  src={product.image} 
                  alt={product.name}
                  onError={(e) => handleImageError(e, product.name)}
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
                  {'★'.repeat(Math.floor(product.rating))}
                  {'☆'.repeat(5 - Math.floor(product.rating))}
                  <span>({product.rating})</span>
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
      </div>
    </div>
  );
};

export default CustomerDashboard;