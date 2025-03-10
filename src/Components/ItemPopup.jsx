import React, { useEffect, useRef } from 'react';
import '../css/AboutMe.css';
import '../css/ItemPopup.css';
import { useSelector, useDispatch } from 'react-redux';
import { addItem } from '../CartSlice.js';
import Cookies from 'js-cookie';


function ItemPopup({ isOpen, onClose, product }) {



  const [quantity, setQuantity] = React.useState(1);
  const [error, setError] = React.useState('');
  const popupContentRef = useRef(null);

  // add redux cart
  const cart = useSelector((state) => state.cart);

  // add redux dispatch
  const dispatch = useDispatch();
  
  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      // Only run this if the popup is open
      if (isOpen && popupContentRef.current && !popupContentRef.current.contains(event.target)) {
        handleClose();
      }
    }
    
    // Add event listener when the popup is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  function getItemQuantity(items, itemId) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.product_id === itemId) {
        return item.quantity; // Found the item, return its quantity
      }
    }
    return 0; // Item not found, return 0 or handle the case as needed
  }

  const handleQuantityChange = (e) => {
    const amountInput = parseInt(e.target.value);
  
    // Get the amount in cart
    const amountInCart = getItemQuantity(cart.items, product.product_id);
  
    const totalAmount = amountInput + amountInCart;
    
    if (amountInput >= 0 && totalAmount <= product.stock_quantity) {
      setQuantity(amountInput);
      setError('');
    } else if (amountInput < 0) {
      setQuantity(0);
      setError('Quantity must be at least 1');
    } else if (totalAmount > product.stock_quantity) {
      // Correctly set the quantity to the remaining stock
      setError(`Total limit for item is ${product.stock_quantity}`);
    } // No need for the final else block

  };

  const handleClose = () => {
    setError('');
    setQuantity(0);
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
      // add to redux using dispath
      // create product obj
      const productToAdd = {
        product_id: product.product_id,
        product_name: product.name,
        image_path: product.image_path,
        quantity: quantity,
        price: product.price,
        maxQuantity: product.stock_quantity,
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