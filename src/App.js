import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/index.css';

// Import pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import CustomerDashboard from './pages/CustomerDashboard';
import ArtisanDashboard from './pages/ArtisanDashboard';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/artisan" element={<ArtisanDashboard />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;