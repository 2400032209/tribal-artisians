import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Logo.css';

const Logo = ({ showText = true }) => {
  const navigate = useNavigate();

  return (
    <div className="logo-wrapper" onClick={() => navigate('/')}>
      <img 
        src="/images/logo.png" 
        alt="Tribal Crafts" 
        className="logo-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = 'none';
          const parent = e.target.parentNode;
          const fallback = document.createElement('div');
          fallback.className = 'logo-fallback';
          fallback.innerHTML = '🪵';
          parent.insertBefore(fallback, e.target);
        }}
      />
      {showText && <span className="logo-text">Tribal Crafts</span>}
    </div>
  );
};

export default Logo;