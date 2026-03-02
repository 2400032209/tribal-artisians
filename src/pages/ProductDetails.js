import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  // Sample product data based on ID
  const getProductData = (id) => {
    const products = {
      1: {
        id: 1,
        name: "Handwoven Wooden Basket",
        price: 899,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Baskets",
        description: "This beautiful handwoven wooden basket is crafted by skilled tribal artisans using traditional techniques passed down through generations. Made from sustainably sourced wood, each basket is unique and tells a story of heritage and craftsmanship.",
        longDescription: "The art of basket weaving has been an integral part of tribal culture for centuries. Each basket is carefully handcrafted using natural materials and traditional techniques. The intricate patterns and designs reflect the rich cultural heritage of the artisans.",
        materials: "Sustainable wood, natural fibers",
        dimensions: "12 inches (diameter) x 8 inches (height)",
        weight: "0.5 kg",
        artisan: "Lakshmi's Crafts",
        artisanBio: "Lakshmi has been weaving baskets for over 20 years, learning the craft from her grandmother. She now leads a collective of women artisans in her village.",
        inStock: true,
        reviews: [
          {
            id: 1,
            user: "Priya S.",
            rating: 5,
            comment: "Absolutely beautiful! The craftsmanship is amazing and it's the perfect size for storing fruits.",
            date: "2024-01-15"
          },
          {
            id: 2,
            user: "Rajesh K.",
            rating: 4,
            comment: "Very sturdy and well-made. Shipping was fast and packaging was eco-friendly.",
            date: "2024-01-10"
          }
        ]
      },
      2: {
        id: 2,
        name: "Tribal Earrings Set",
        price: 399,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1630019852942-f89202989c59?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Jewelry",
        description: "Authentic tribal earrings handcrafted using traditional techniques. Each pair tells a unique story through its intricate designs and patterns.",
        materials: "Silver, natural beads",
        artisan: "Tribal Heritage",
        inStock: true,
        reviews: []
      },
      3: {
        id: 3,
        name: "Bamboo Chair",
        price: 2499,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Furniture",
        description: "Handcrafted bamboo chair, eco-friendly and durable. Perfect for adding a touch of rustic elegance to your home.",
        materials: "Bamboo, natural rope",
        artisan: "Green Crafts",
        inStock: true,
        reviews: []
      },
      4: {
        id: 4,
        name: "Handmade Cotton Towel",
        price: 299,
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1583848925546-3c8c9df2b9b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Textiles",
        description: "Soft, handwoven cotton towel with traditional tribal patterns. Each piece is uniquely crafted by skilled weavers.",
        materials: "Organic cotton",
        artisan: "Weavers of India",
        inStock: true,
        reviews: []
      }
    };
    return products[id] || products[1];
  };

  const product = getProductData(id);

  useEffect(() => {
    if (product) {
      setReviews(product.reviews || []);
    }
  }, [id, product]);

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${quantity} item(s) added to cart!`);
  };

  const handleAddToWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.find(item => item.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      alert('Added to wishlist!');
    } else {
      alert('Product already in wishlist!');
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      alert('Please enter a review comment');
      return;
    }
    
    const review = {
      id: reviews.length + 1,
      user: "Current User",
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString('en-IN')
    };
    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    alert('Review submitted successfully!');
  };

  if (!product) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="product-details">
      {/* Header */}
      <header className="details-header">
        <div className="header-left" onClick={() => navigate('/')}>
          <img src="/images/tribal-logo.png" alt="Logo" className="header-logo" />
          <h1>Tribal Crafts</h1>
        </div>
        <div className="header-right">
          <div className="cart-icon" onClick={() => navigate('/cart')}>
            🛒
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span onClick={() => navigate('/')}>Home</span> &gt; 
        <span onClick={() => navigate('/customer')}>Products</span> &gt; 
        <span>{product.name}</span>
      </div>

      <div className="product-container">
        {/* Product Images */}
        <div className="product-images">
          <div className="main-image">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="thumbnail-images">
            <img src={product.image} alt="Thumbnail 1" />
            <img src={product.image} alt="Thumbnail 2" />
            <img src={product.image} alt="Thumbnail 3" />
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="artisan-name">by {product.artisan}</p>
          
          <div className="rating">
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
            <span>({product.rating} stars)</span>
          </div>

          <div className="price-section">
            <span className="current-price">₹{product.price}</span>
            {product.originalPrice && (
              <span className="original-price">₹{product.originalPrice}</span>
            )}
          </div>

          <div className="availability">
            Status: {product.inStock ? 
              <span className="in-stock">In Stock</span> : 
              <span className="out-of-stock">Out of Stock</span>
            }
          </div>

          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
            {product.longDescription && <p>{product.longDescription}</p>}
          </div>

          {product.materials && (
            <div className="materials">
              <h3>Materials</h3>
              <p>{product.materials}</p>
            </div>
          )}

          {product.dimensions && (
            <div className="dimensions">
              <h3>Dimensions</h3>
              <p>{product.dimensions}</p>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="quantity-selector">
            <h3>Quantity:</h3>
            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange(-1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              🛒 Add to Cart
            </button>
            <button 
              className="buy-now-btn"
              onClick={() => {
                handleAddToCart();
                navigate('/checkout');
              }}
              disabled={!product.inStock}
            >
              Buy Now
            </button>
            <button 
              className="wishlist-btn"
              onClick={handleAddToWishlist}
            >
              ♥ Wishlist
            </button>
          </div>

          {/* Artisan Info */}
          <div className="artisan-info">
            <h3>About the Artisan</h3>
            <p>{product.artisanBio || `${product.artisan} creates beautiful handmade products using traditional techniques passed down through generations.`}</p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        
        {/* Add Review Form */}
        <div className="add-review">
          <h3>Write a Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <div className="rating-select">
              <label>Rating:</label>
              <select 
                value={newReview.rating}
                onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
              >
                {[5,4,3,2,1].map(num => (
                  <option key={num} value={num}>{num} stars</option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Share your experience with this product..."
              value={newReview.comment}
              onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              rows="4"
            ></textarea>
            <button type="submit">Submit Review</button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <span className="reviewer-name">{review.user}</span>
                  <span className="review-date">{review.date}</span>
                </div>
                <div className="review-rating">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;