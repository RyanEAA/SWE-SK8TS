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
  const popupContentRef = useRef(null);

  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Parse customizations if they are stringified
  const parsedCustomizations = React.useMemo(() => {
    if (!product || !product.customizations) {
      return [];
    }
  
    try {
      return typeof product.customizations === 'string'
        ? JSON.parse(product.customizations)
        : product.customizations || [];
    } catch (error) {
      console.error('Failed to parse customizations:', error);
      return [];
    }
  }, [product]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && popupContentRef.current && !popupContentRef.current.contains(event.target)) {
        handleClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    // Set the default customization to the first option if available
    if (parsedCustomizations.length > 0) {
      setSelectedCustomization(parsedCustomizations[0]);
    }
  }, [parsedCustomizations]);

  if (!isOpen || !product) return null;

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
          />
        </div>
        <div className="customizations">
          <h3>Customization:</h3>
          {parsedCustomizations.length > 0 ? (
            <select
              id="customization"
              value={selectedCustomization}
              onChange={handleCustomizationChange}
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
        <button className="btn btn-green" onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
}

export default ItemPopup;