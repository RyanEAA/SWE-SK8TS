import React from 'react';
import '../css/AboutMe.css';
import '../css/ItemPopup.css';

function ItemPopup({ isOpen, onClose, product, onAdd }) {
  const [quantity, setQuantity] = React.useState(1);
  const [error, setError] = React.useState('');

  if (!isOpen || !product) return null;

  const handleQuantityChange = (e) => {
    const amount = parseInt(e.target.value);
    if (amount >= 1 && amount <= product.stock_quantity) {
      setQuantity(amount);
      setError('');
    } else {
      setQuantity(amount);
      setError(`Quantity must be between 1 and ${product.stock_quantity}`);
    }
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  const handleAddToCart = () => {
    if (!error) {
      onAdd(product, quantity); // Pass quantity directly
      handleClose();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={handleClose}>×</button>
        <img
          src={product.image_url || `/Images/products/${product.image_path}`}
          alt={product.name}
          className="popup-image"
        />
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <div className="quantity-input">
          <h1>Quantity:</h1>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            max={product.stock_quantity}
          />
        </div>
        <div className="error-message">{error}</div>
        <button onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}

export default ItemPopup;