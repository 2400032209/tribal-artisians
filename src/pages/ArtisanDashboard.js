import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import Logo from '../components/Logo';
import './ArtisanDashboard.css';

const ArtisanDashboard = () => {
  const navigate = useNavigate();
  const { products, updateProduct } = useProducts();
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter products for this artisan (assuming artisanId = "artisan1" for demo)
  const artisanProducts = products.filter(p => p.artisanId === 'artisan1' || !p.artisanId);

  const [orders] = useState([
    {
      id: "ORD001",
      customer: "Priya Sharma",
      date: "2024-01-15",
      total: 1798,
      status: "delivered",
      items: [
        { name: "Handwoven Wooden Basket", quantity: 2, price: 899 }
      ]
    },
    {
      id: "ORD002",
      customer: "Rahul Verma",
      date: "2024-01-16",
      total: 399,
      status: "processing",
      items: [
        { name: "Tribal Earrings Set", quantity: 1, price: 399 }
      ]
    },
    {
      id: "ORD003",
      customer: "Anita Desai",
      date: "2024-01-17",
      total: 2499,
      status: "shipped",
      items: [
        { name: "Bamboo Chair", quantity: 1, price: 2499 }
      ]
    }
  ]);

  const handleLogout = () => {
    navigate('/');
  };

  const handleToggleProductStatus = (productId) => {
    const product = artisanProducts.find(p => p.id === productId);
    if (product) {
      updateProduct(productId, { 
        status: product.status === 'active' ? 'inactive' : 'active' 
      });
    }
  };

  const handleAddProduct = () => {
    navigate('/add-product');
  };

  const handleEditProduct = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const filteredProducts = artisanProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return '#4caf50';
      case 'processing': return '#ff9800';
      case 'shipped': return '#2196f3';
      default: return '#999';
    }
  };

  const totalEarnings = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = artisanProducts.length;
  const lowStockItems = artisanProducts.filter(p => p.stock < 10).length;

  return (
    <div className="artisan-dashboard">
      <header className="artisan-header">
        <div className="header-left" onClick={() => navigate('/')}>
          <Logo showText={false} />
          <h1>Artisan Dashboard</h1>
        </div>
        
        <div className="header-right">
          <div className="artisan-info">
            <span className="artisan-name">Lakshmi's Crafts</span>
            <span className="artisan-badge">Artisan</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-details">
            <h3>Total Earnings</h3>
            <p className="stat-value">₹{totalEarnings}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-details">
            <h3>Total Orders</h3>
            <p className="stat-value">{totalOrders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🪑</div>
          <div className="stat-details">
            <h3>Products</h3>
            <p className="stat-value">{totalProducts}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-details">
            <h3>Low Stock</h3>
            <p className="stat-value">{lowStockItems}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          My Products
        </button>
        <button 
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'products' && (
          <div className="products-tab">
            <div className="products-header">
              <h2>My Products</h2>
              <div className="header-actions">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="search-icon">🔍</span>
                </div>
                <button 
  className="add-product-btn"
  onClick={() => navigate('/add-product')}
>
  + Add New Product
</button>
              </div>
            </div>

            {artisanProducts.length === 0 ? (
              <div className="no-products">
                <p>You haven't added any products yet.</p>
                <button onClick={handleAddProduct} className="add-first-product-btn">
                  Add Your First Product
                </button>
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
                      <span className={`product-status-badge ${product.status}`}>
                        {product.status}
                      </span>
                    </div>
                    
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <p className="product-category">{product.category}</p>
                      <p className="product-price">₹{product.price}</p>
                      
                      <div className="product-stats">
                        <div className="stat">
                          <span className="stat-label">Stock:</span>
                          <span className="product-stat-value">{product.stock}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-label">Orders:</span>
                          <span className="product-stat-value">{product.orders || 0}</span>
                        </div>
                      </div>

                      <p className="product-description">{product.description}</p>

                      <div className="product-actions">
                        <button 
                          className={`status-toggle ${product.status}`}
                          onClick={() => handleToggleProductStatus(product.id)}
                        >
                          {product.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditProduct(product.id)}
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-tab">
            <h2>Recent Orders</h2>
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className="order-id">{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>
                        {order.items.map(item => 
                          `${item.name} (${item.quantity})`
                        ).join(', ')}
                      </td>
                      <td className="order-total">₹{order.total}</td>
                      <td>
                        <span 
                          className="order-status-badge" 
                          style={{backgroundColor: getStatusColor(order.status)}}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <h2>Sales Analytics</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Monthly Sales</h3>
                <div className="chart-placeholder">
                  <div className="bar-chart">
                    <div className="bar" style={{height: '60px'}}>Week 1</div>
                    <div className="bar" style={{height: '80px'}}>Week 2</div>
                    <div className="bar" style={{height: '45px'}}>Week 3</div>
                    <div className="bar" style={{height: '70px'}}>Week 4</div>
                  </div>
                </div>
              </div>
              
              <div className="analytics-card">
                <h3>Top Products</h3>
                <div className="top-products">
                  {artisanProducts.slice(0, 3).map(product => (
                    <div key={product.id} className="top-product">
                      <span>{product.name}</span>
                      <span className="sales-count">{product.orders || 0} sold</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="analytics-card">
                <h3>Category Distribution</h3>
                <div className="pie-chart-placeholder">
                  <div className="legend">
                    <div><span className="color-box" style={{backgroundColor: '#8B4513'}}></span> Baskets</div>
                    <div><span className="color-box" style={{backgroundColor: '#A0522D'}}></span> Jewelry</div>
                    <div><span className="color-box" style={{backgroundColor: '#CD853F'}}></span> Furniture</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanDashboard;