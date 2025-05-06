import React, { useEffect, useRef } from 'react';
import '../css/AboutMe.css';
import '../css/ItemPopup.css';
import { useSelector, useDispatch } from 'react-redux';
import { addItem } from '../CartSlice.js';
import Cookies from 'js-cookie';

function ItemPopup({ isOpen, onClose, product }) {
  const [quantity, setQuantity] = React.useState(1);
  const [error, setError] = React.useState('');
  const [selectedCustomization, setSelectedCustomization] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const popupContentRef = useRef(null);

  // Safe product access
  const safeProduct = product || {};
  
  // Parse customizations safely
  const parsedCustomizations = React.useMemo(() => {
    if (!safeProduct.customizations) return [];
    
    try {
      return typeof safeProduct.customizations === 'string'
        ? JSON.parse(safeProduct.customizations)
        : safeProduct.customizations || [];
    } catch (error) {
      console.error('Failed to parse customizations:', error);
      return [];
    }
  }, [safeProduct.customizations]);

  useEffect(() => {
    if (isOpen && safeProduct) {
      setIsLoading(false);
      // Set default customization
      if (parsedCustomizations.length > 0) {
        setSelectedCustomization(parsedCustomizations[0]);
      }
    } else {
      setIsLoading(true);
    }
  }, [isOpen, safeProduct, parsedCustomizations]);

  if (!isOpen || isLoading) return null;

  const isOutOfStock = safeProduct.stock_quantity <= 0;

  const handleQuantityChange = (e) => {
    const amountInput = parseInt(e.target.value);
    const amountInCart = cart.items.find((item) => item.product_id === product.product_id)?.quantity || 0;
    const totalAmount = amountInput + amountInCart;

    if (amountInput >= 0 && totalAmount <= product.stock_quantity) {
      setQuantity(amountInput);
      setError('');
    } else if (amountInput < 0) {
      setQuantity(0);
      setError('Quantity must be at least 1');
    } else if (totalAmount > product.stock_quantity) {
      setError(`Total limit for item is ${product.stock_quantity}`);
    }
  };

  const handleCustomizationChange = (e) => {
    setSelectedCustomization(e.target.value);
  };

  const handleClose = () => {
    setError('');
    setQuantity(1);
    setSelectedCustomization('');
    onClose();
  };

  const handleAddToCart = () => {
    const username = Cookies.get('user');
    if (!username) {
      alert('You must be logged in to check out.');
      navigate('/shop');
      return;
    }

    if (!error || error === `Total limit for item is ${product.stock_quantity}`) {
      const productToAdd = {
        product_id: product.product_id,
        product_name: product.name,
        image_path: product.image_path,
        quantity: quantity,
        price: product.price,
        maxQuantity: product.stock_quantity,
        customizations: selectedCustomization, // Only the selected customization
      };
      dispatch(addItem(productToAdd));
      handleClose();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content" ref={popupContentRef}>
        <button className="close-button" onClick={handleClose}>×</button>
        <img
          src={product.image_url || `/Images/products/${product.image_path}`}
          alt={product.name}
          className="popup-image"
        />
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p><strong>${product.price}</strong></p>
        <div className="quantity-input" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1>Quantity:</h1>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            max={product.stock_quantity}
            disabled={isOutOfStock}  // Added disabled state when out of stock
          />
        </div>
        <div className="customizations">
          <h3>Customization:</h3>
          {parsedCustomizations.length > 0 ? (
            <select
              id="customization"
              value={selectedCustomization}
              onChange={handleCustomizationChange}
              disabled={isOutOfStock}  // Added disabled state when out of stock
            >
              {parsedCustomizations.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <p>No customizations available for this product.</p>
          )}
        </div>
        <div className="error-message">{error}</div>
        {isOutOfStock ? (
          <button 
            className="btn btn-red" 
            disabled
            style={{ opacity: 0.7, cursor: 'not-allowed' }}
          >
            Out of Stock
          </button>
        ) : (
          <button 
            className="btn btn-green" 
            onClick={handleAddToCart}
            disabled={!!error}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ItemPopup;