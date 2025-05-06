import React, { useEffect, useRef } from 'react';
import '../css/AboutMe.css';
import '../css/ItemPopup.css';
import { useSelector, useDispatch } from 'react-redux';
import { addItem } from '../CartSlice.js';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function ItemPopup({ isOpen, onClose, product }) {
  const [quantity, setQuantity] = React.useState(1);
  const [error, setError] = React.useState('');
  const [selectedCustomization, setSelectedCustomization] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const popupContentRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(state => state.cart);

  // Safe product access
  const safeProduct = product || {};
  
  // Parse customizations safely
  const parsedCustomizations = React.useMemo(() => {
    if (!safeProduct.customizations) return [];
    
    try {
      if (Array.isArray(safeProduct.customizations)) {
        return safeProduct.customizations;
      }
      
      const parsed = typeof safeProduct.customizations === 'string'
        ? JSON.parse(safeProduct.customizations)
        : safeProduct.customizations;
      
      return Array.isArray(parsed) ? parsed : [];
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
    const amountInput = parseInt(e.target.value) || 0;
    const amountInCart = cart.items.find((item) => item.product_id === safeProduct.product_id)?.quantity || 0;
    const totalAmount = amountInput + amountInCart;

    if (amountInput >= 1 && totalAmount <= safeProduct.stock_quantity) {
      setQuantity(amountInput);
      setError('');
    } else if (amountInput < 1) {
      setQuantity(1);
      setError('Quantity must be at least 1');
    } else if (totalAmount > safeProduct.stock_quantity) {
      setError(`Only ${safeProduct.stock_quantity - amountInCart} available`);
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
      navigate('/login');
      return;
    }

    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    const productToAdd = {
      product_id: safeProduct.product_id,
      product_name: safeProduct.name,
      image_path: safeProduct.image_path,
      quantity: quantity,
      price: safeProduct.price,
      maxQuantity: safeProduct.stock_quantity,
      customizations: selectedCustomization,
    };
    
    dispatch(addItem(productToAdd));
    handleClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content" ref={popupContentRef}>
        <button className="close-button" onClick={handleClose}>×</button>
        <img
          src={safeProduct.image_url || `/Images/products/${safeProduct.image_path}`}
          alt={safeProduct.name}
          className="popup-image"
        />
        <h2>{safeProduct.name}</h2>
        <p>{safeProduct.description}</p>
        <p><strong>${safeProduct.price}</strong></p>
        <div className="quantity-input" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1>Quantity:</h1>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            max={safeProduct.stock_quantity}
            disabled={isOutOfStock}
          />
        </div>
        {parsedCustomizations.length > 0 && (
          <div className="customizations">
            <h3>Customization:</h3>
            <select
              id="customization"
              value={selectedCustomization}
              onChange={handleCustomizationChange}
              disabled={isOutOfStock}
            >
              {parsedCustomizations.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
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
            disabled={!!error || quantity < 1}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ItemPopup;