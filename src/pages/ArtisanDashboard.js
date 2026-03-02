import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ArtisanDashboard.css';

const ArtisanDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Wooden Basket",
      price: 899,
      stock: 15,
      orders: 23,
      image: "/images/wooden-basket.png",
      category: "Baskets",
      description: "Traditional handwoven basket made from sustainable wood",
      status: "active"
    },
    {
      id: 2,
      name: "Tribal Earrings Set",
      price: 399,
      stock: 50,
      orders: 45,
      image: "/images/tribal-earrings.png",
      category: "Jewelry",
      description: "Authentic tribal earrings with traditional designs",
      status: "active"
    },
    {
      id: 3,
      name: "Bamboo Chair",
      price: 2499,
      stock: 8,
      orders: 12,
      image: "/images/bamboo-chair.png",
      category: "Furniture",
      description: "Handcrafted bamboo chair, eco-friendly and durable",
      status: "active"
    }
  ]);

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
    const updatedProducts = products.map(product => 
      product.id === productId 
        ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
        : product
    );
    setProducts(updatedProducts);
  };

  const filteredProducts = products.filter(product =>
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
  const totalProducts = products.length;
  const lowStockItems = products.filter(p => p.stock < 10).length;

  return (
    <div className="artisan-dashboard">
      <header className="artisan-header">
        <div className="header-left" onClick={() => navigate('/')}>
          <img src="/images/logo.png" alt="Tribal Crafts Logo" className="header-logo" />
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
                  onClick={() => setShowAddProduct(true)}
                >
                  + Add New Product
                </button>
              </div>
            </div>

            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
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
                        <span className="product-stat-value">{product.orders}</span>
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
                      <button className="edit-btn">Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtisanDashboard;