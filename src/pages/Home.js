import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/api';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();

      const mappedProducts = data.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        rating: 4.5,
        image: product.imageUrl,
        artisan: product.artisan?.name || 'Tribal Artisan'
      }));

      setFeaturedProducts(mappedProducts);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const categories = [
    { name: "Baskets", icon: "🧺", count: 45 },
    { name: "Jewelry", icon: "💍", count: 78 },
    { name: "Furniture", icon: "🪑", count: 23 },
    { name: "Textiles", icon: "🧵", count: 56 },
    { name: "Pottery", icon: "🏺", count: 34 },
    { name: "Paintings", icon: "🎨", count: 42 }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Customer",
      comment: "Beautiful handmade products! The quality is exceptional and it feels good to support tribal artisans.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      id: 2,
      name: "Rahul Verma",
      role: "Artisan",
      comment: "This platform has helped me reach customers worldwide. My family's craft is now recognized globally.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 3,
      name: "Anita Desai",
      role: "Customer",
      comment: "The bamboo chair I bought is stunning! Great craftsmanship and fast delivery.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/2.jpg"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Discover Authentic Tribal Handicrafts</h1>
          <p>Support traditional artisans and bring home unique, handcrafted treasures</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/customer')}>
              Shop Now
            </button>
            <button className="btn-secondary" onClick={() => navigate('/login', { state: { userType: 'artisan' } })}>
              Become an Artisan
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Tribal Artisans" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <div key={index} className="category-card" onClick={() => navigate('/customer')}>
              <span className="category-icon">{category.icon}</span>
              <h3>{category.name}</h3>
              <p>{category.count} products</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x200/8B4513/ffffff?text=" + encodeURIComponent(product.name);
                  }}
                />
                <div className="product-overlay">
                  <button className="quick-view">Quick View</button>
                </div>
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="artisan">by {product.artisan}</p>
                <div className="rating">
                  {'★'.repeat(Math.floor(product.rating))}
                  {'☆'.repeat(5 - Math.floor(product.rating))}
                  <span>({product.rating})</span>
                </div>
                <p className="price">₹{product.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all">
          <button className="btn-outline" onClick={() => navigate('/customer')}>
            View All Products →
          </button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <h2>Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature">
            <span className="feature-icon">🤝</span>
            <h3>Direct from Artisans</h3>
            <p>No middlemen - you support the artists directly</p>
          </div>
          <div className="feature">
            <span className="feature-icon">✨</span>
            <h3>Handcrafted Quality</h3>
            <p>Each piece is unique and made with care</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🌿</span>
            <h3>Eco-Friendly</h3>
            <p>Sustainable materials and traditional techniques</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🌍</span>
            <h3>Global Shipping</h3>
            <p>We deliver worldwide</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <h2>What People Say</h2>
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <img src={testimonial.image} alt={testimonial.name} />
                <div>
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
              <div className="testimonial-rating">
                {'★'.repeat(testimonial.rating)}
                {'☆'.repeat(5 - testimonial.rating)}
              </div>
              <p className="testimonial-comment">"{testimonial.comment}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Stay Updated</h2>
          <p>Subscribe to get updates on new products and artisan stories</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Tribal Crafts</h3>
            <p>Preserving heritage, empowering artisans</p>
            <div className="social-links">
              <a href="#facebook">📘</a>
              <a href="#instagram">📷</a>
              <a href="#twitter">🐦</a>
              <a href="#pinterest">📌</a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#shipping">Shipping Info</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>For Artisans</h4>
            <ul>
              <li><a href="#sell">Start Selling</a></li>
              <li><a href="#guidelines">Guidelines</a></li>
              <li><a href="#support">Artisan Support</a></li>
              <li><a href="#success">Success Stories</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Us</h4>
            <ul>
              <li>📞 +91 1234567890</li>
              <li>✉️ support@tribalcrafts.com</li>
              <li>📍 Mumbai, India</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Tribal Crafts. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;