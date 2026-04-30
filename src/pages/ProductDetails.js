import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await getProductById(id);

      const mappedProduct = {
        id: data.id,
        name: data.name,
        price: data.price,
        rating: 4.5,
        image: data.imageUrl,
        category: data.category,
        description: data.description,
        materials: data.materials || 'Traditional handcrafted materials',
        artisan: data.artisan?.name || 'Tribal Artisan',
        artisanBio:
          data.artisan?.bio ||
          'This artisan creates beautiful handmade products using traditional techniques passed down through generations.',
        inStock: data.stock > 0,
        stock: data.stock,
        reviews: data.reviews || []
      };

      setProduct(mappedProduct);
      setReviews(mappedProduct.reviews || []);
    } catch (error) {
      console.error('Failed to load product:', error);
      alert('Failed to load product details');
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  // ✅ UPDATED: Now using backend instead of localStorage
  const handleAddToCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const response = await fetch("http://localhost:8080/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: Number(product.id),   // ✅ correct product id
          quantity: quantity,
          userId: user.id || 1             // ✅ ensure user id exists
        })
      });

      if (!response.ok) {
        throw new Error();
      }

      alert(`${quantity} item(s) added to cart!`);

    } catch (error) {
      console.error(error);
      alert("Failed to add to cart");
    }
  };

  // ✅ UPDATED: Now using backend instead of localStorage
  const handleAddToWishlist = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const response = await fetch("http://localhost:8080/api/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: Number(product.id),   // ✅ correct product id
          userId: user.id || 1             // ✅ ensure user id exists
        })
      });

      if (!response.ok) {
        throw new Error();
      }

      alert('Added to wishlist!');

    } catch (error) {
      console.error(error);
      alert("Failed to add to wishlist");
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
      user: 'Current User',
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
      <header className="details-header">
        <div className="header-left" onClick={() => navigate('/')}>
          <img src="/images/logo.png" alt="Logo" className="header-logo" />
          <h1>Tribal Crafts</h1>
        </div>
        <div className="header-right">
          <div className="cart-icon" onClick={() => navigate('/cart')}>
            🛒
          </div>
        </div>
      </header>

      <div className="breadcrumb">
        <span onClick={() => navigate('/')}>Home</span> &gt;
        <span onClick={() => navigate('/customer')}>Products</span> &gt;
        <span>{product.name}</span>
      </div>

      <div className="product-container">
        <div className="product-images">
          <div className="main-image">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://via.placeholder.com/300x200/8B4513/ffffff?text=' +
                  encodeURIComponent(product.name);
              }}
            />
          </div>
          <div className="thumbnail-images">
            <img src={product.image} alt="Thumbnail 1" />
            <img src={product.image} alt="Thumbnail 2" />
            <img src={product.image} alt="Thumbnail 3" />
          </div>
        </div>

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
          </div>

          <div className="availability">
            Status:{' '}
            {product.inStock ? (
              <span className="in-stock">In Stock</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>

          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.materials && (
            <div className="materials">
              <h3>Materials</h3>
              <p>{product.materials}</p>
            </div>
          )}

          <div className="quantity-selector">
            <h3>Quantity:</h3>
            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange(-1)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)}>+</button>
            </div>
          </div>

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

          <div className="artisan-info">
            <h3>About the Artisan</h3>
            <p>{product.artisanBio}</p>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Customer Reviews</h2>

        <div className="add-review">
          <h3>Write a Review</h3>
          <form onSubmit={handleReviewSubmit}>
            <div className="rating-select">
              <label>Rating:</label>
              <select
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({
                    ...newReview,
                    rating: parseInt(e.target.value)
                  })
                }
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>
                    {num} stars
                  </option>
                ))}
              </select>
            </div>

            <textarea
              placeholder="Share your experience with this product..."
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              rows="4"
            ></textarea>

            <button type="submit">Submit Review</button>
          </form>
        </div>

        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map((review) => (
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
            <p className="no-reviews">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;