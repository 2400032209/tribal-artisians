import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    // Shipping Information
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    
    // Payment Information
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    upiId: ''
  });
  
  const [errors, setErrors] = useState({});

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      navigate('/cart'); // Redirect to cart if empty
    }
    setCartItems(cart);
  }, [navigate]);

  // Calculate totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 1000 ? 0 : 50;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Shipping validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d+$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must contain only digits';
    } else if (formData.pincode.length !== 6) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must contain only digits';
    } else if (formData.phone.length !== 10) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Payment validation based on method
    if (paymentMethod === 'card') {
      if (!formData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d+$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Card number must contain only digits';
      } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }

      if (!formData.cardName.trim()) {
        newErrors.cardName = 'Name on card is required';
      }

      if (!formData.expiry) {
        newErrors.expiry = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
        newErrors.expiry = 'Expiry must be in MM/YY format';
      } else {
        const [month, year] = formData.expiry.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        
        if (parseInt(month) < 1 || parseInt(month) > 12) {
          newErrors.expiry = 'Invalid month';
        } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
          newErrors.expiry = 'Card has expired';
        }
      }

      if (!formData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d+$/.test(formData.cvv)) {
        newErrors.cvv = 'CVV must contain only digits';
      } else if (formData.cvv.length !== 3) {
        newErrors.cvv = 'CVV must be 3 digits';
      }
    } else if (paymentMethod === 'upi') {
      if (!formData.upiId) {
        newErrors.upiId = 'UPI ID is required';
      } else if (!formData.upiId.includes('@')) {
        newErrors.upiId = 'Please enter a valid UPI ID (e.g., name@bank)';
      }
    } else if (!paymentMethod) {
      newErrors.payment = 'Please select a payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Handle card number input
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  // Handle expiry input
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setFormData(prev => ({
      ...prev,
      expiry: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Process order
      const orderDetails = {
        orderId: 'ORD' + Math.floor(Math.random() * 1000000),
        items: cartItems,
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`
        },
        paymentMethod: paymentMethod,
        subtotal: calculateSubtotal(),
        shipping: calculateShipping(),
        tax: calculateTax(),
        total: calculateTotal(),
        date: new Date().toLocaleDateString('en-IN'),
        status: 'confirmed'
      };

      // Save order to localStorage (for demo)
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(orderDetails);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // Show confirmation
      setOrderPlaced(true);
    }
  };

  // Order Confirmation View
  if (orderPlaced) {
    return (
      <div className="order-confirmation">
        <div className="confirmation-card">
          <div className="success-icon">✓</div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. Your order has been successfully placed.</p>
          <p className="order-number">
            Order #: ORD{Math.floor(Math.random() * 1000000)}
          </p>
          <p className="confirmation-message">
            A confirmation email has been sent to <strong>{formData.email}</strong>
          </p>
          <p className="delivery-estimate">
            Estimated Delivery: {new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString('en-IN')}
          </p>
          <button 
            onClick={() => navigate('/customer')} 
            className="continue-shopping"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Header */}
      <header className="checkout-header">
        <div className="header-left" onClick={() => navigate('/')}>
          <img src="/images/tribal-logo.png" alt="Logo" className="header-logo" />
          <h1>Tribal Crafts</h1>
        </div>
      </header>

      <div className="checkout-container">
        <h1>Checkout</h1>
        
        <div className="checkout-content">
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Shipping Address Section */}
            <div className="form-section">
              <h2>Shipping Address</h2>
              
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <label>Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  rows="3"
                  className={errors.address ? 'error' : ''}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>

                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    maxLength="6"
                    className={errors.pincode ? 'error' : ''}
                  />
                  {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="form-section">
              <h2>Payment Method</h2>
              
              <div className="payment-methods">
                <label className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>💳 Credit/Debit Card</span>
                </label>

                <label className={`payment-method ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>📱 UPI</span>
                </label>

                <label className={`payment-method ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>💵 Cash on Delivery</span>
                </label>
              </div>
              {errors.payment && <span className="error-message">{errors.payment}</span>}

              {/* Card Payment Details */}
              {paymentMethod === 'card' && (
                <div className="payment-details card-details">
                  <h3>Card Details</h3>
                  
                  <div className="form-group">
                    <label>Card Number *</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className={errors.cardNumber ? 'error' : ''}
                    />
                    {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                  </div>

                  <div className="form-group">
                    <label>Name on Card *</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="As shown on card"
                      className={errors.cardName ? 'error' : ''}
                    />
                    {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry (MM/YY) *</label>
                      <input
                        type="text"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className={errors.expiry ? 'error' : ''}
                      />
                      {errors.expiry && <span className="error-message">{errors.expiry}</span>}
                    </div>

                    <div className="form-group">
                      <label>CVV *</label>
                      <input
                        type="password"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        placeholder="123"
                        maxLength="3"
                        className={errors.cvv ? 'error' : ''}
                      />
                      {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* UPI Payment Details */}
              {paymentMethod === 'upi' && (
                <div className="payment-details upi-details">
                  <h3>UPI Details</h3>
                  
                  <div className="form-group">
                    <label>UPI ID *</label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      placeholder="username@okhdfcbank"
                      className={errors.upiId ? 'error' : ''}
                    />
                    {errors.upiId && <span className="error-message">{errors.upiId}</span>}
                  </div>
                  
                  <div className="upi-apps">
                    <p>Pay with any UPI app:</p>
                    <div className="app-icons">
                      <span>📱 Google Pay</span>
                      <span>📱 PhonePe</span>
                      <span>📱 Paytm</span>
                      <span>📱 BHIM</span>
                    </div>
                  </div>
                </div>
              )}

              {/* COD Notice */}
              {paymentMethod === 'cod' && (
                <div className="payment-details cod-details">
                  <p>💵 Pay with cash when your order is delivered</p>
                  <p className="cod-note">Additional ₹40 handling fee may apply</p>
                </div>
              )}
            </div>

            <button type="submit" className="place-order-btn">
              Place Order • ₹{calculateTotal().toFixed(2)}
            </button>
          </form>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Your Order</h2>
            
            <div className="order-items">
              {cartItems.map((item, index) => (
                <div key={index} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p className="item-artisan">by {item.artisan || 'Tribal Artisan'}</p>
                    <p className="item-quantity">Quantity: {item.quantity || 1}</p>
                  </div>
                  <span className="item-price">₹{item.price * (item.quantity || 1)}</span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>{calculateShipping() === 0 ? 'Free' : `₹${calculateShipping()}`}</span>
              </div>
              <div className="total-row">
                <span>Tax (18% GST)</span>
                <span>₹{calculateTax().toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Secure Checkout Notice */}
            <div className="secure-checkout">
              <p>🔒 Secure Checkout</p>
              <p className="secure-note">Your payment information is encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;