import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    // Navigate to login with user type
    navigate('/login', { state: { userType: type } });
  };

  return (
    <div className="landing-container">
      <div className="hero-section">
        <div className="logo-container">
          <img src="/images/logo.png" alt="Tribal Crafts Logo" className="logo" />
          <h1 className="site-title">Tribal Crafts</h1>
          <p className="tagline">Preserving Heritage, Empowering Artisans</p>
        </div>

        <div className="user-selection">
          <h2>Choose Your Role</h2>
          <div className="selection-cards">
            <div 
              className="selection-card customer"
              onClick={() => handleUserTypeSelect('customer')}
            >
              <div className="card-icon">🛍️</div>
              <h3>I'm a Customer</h3>
              <p>Explore and purchase authentic tribal handicrafts</p>
            </div>

            <div 
              className="selection-card seller"
              onClick={() => handleUserTypeSelect('seller')}
            >
              <div className="card-icon">🎨</div>
              <h3>I'm an Artisan</h3>
              <p>Sell your handmade creations to the world</p>
            </div>
          </div>
        </div>

        <div className="featured-products">
          <h2>Featured Products</h2>
          <div className="product-previews">
            <div className="preview-item">
              <img src="/images/wooden-basket.jpg" alt="Wooden Basket" />
              <p>Handwoven Wooden Basket</p>
              <span className="price">₹899</span>
            </div>
            <div className="preview-item">
              <img src="/images/tribal-earrings.jpg" alt="Tribal Earrings" />
              <p>Traditional Tribal Earrings</p>
              <span className="price">₹399</span>
            </div>
            <div className="preview-item">
              <img src="/images/bamboo-chair.jpg" alt="Bamboo Chair" />
              <p>Handcrafted Bamboo Chair</p>
              <span className="price">₹2,499</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;