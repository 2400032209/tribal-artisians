import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import Logo from '../components/Logo';
import './AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    image: '',
    artisan: 'Lakshmi\'s Crafts',
    artisanId: 'artisan1'
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Baskets', 'Jewelry', 'Furniture', 'Textiles', 'Pottery'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price) newErrors.price = 'Price is required';
    else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) 
      newErrors.price = 'Enter a valid price';
    if (!formData.category) newErrors.category = 'Select a category';
    if (!formData.stock) newErrors.stock = 'Stock is required';
    else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) 
      newErrors.stock = 'Enter valid stock';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      addProduct({
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        image: formData.image || `https://via.placeholder.com/400x300/8B4513/ffffff?text=${formData.name}`
      });
      alert('Product added successfully!');
      navigate('/artisan');
    } catch (error) {
      alert('Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-product-page">
      <header className="add-product-header">
        <Logo />
        <h1>Add New Product</h1>
        <button className="back-btn" onClick={() => navigate('/artisan')}>← Back</button>
      </header>

      <div className="add-product-container">
        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="form-group">
            <label>Product Name *</label>
            <input name="name" value={formData.name} onChange={handleChange} className={errors.name ? 'error' : ''} />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className={errors.price ? 'error' : ''} />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>
            <div className="form-group">
              <label>Stock *</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} className={errors.stock ? 'error' : ''} />
              {errors.stock && <span className="error-message">{errors.stock}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} className={errors.category ? 'error' : ''}>
              <option value="">Select</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className={errors.description ? 'error' : ''} />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label>Image URL (optional)</label>
            <input name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Product'}
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate('/artisan')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;