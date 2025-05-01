import React, { useEffect, useRef } from 'react';
import '../css/AboutMe.css';
import '../css/ItemPopup.css';
import { useSelector, useDispatch } from 'react-redux';
import { addItem } from '../CartSlice.js';
import Cookies from 'js-cookie';


function ItemPopup({ isOpen, onClose, product }) {


  const [selectedCustomization, setSelectedCustomization] = useState('');
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

  const handleCustomizationChange = (e) => {
    setSelectedCustomization(e.target.value);
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
    <div className={`popup ${isOpen ? 'open' : ''}`}>
      <div className="popup-content">
        <h1>{product.name}</h1>
        <p>Price: ${product.price}</p>
        <p>Stock: {product.stock_quantity}</p>

        {product.customizations.length > 0 && (
          <div>
            <label htmlFor="customization">Choose Customization:</label>
            <select
              id="customization"
              value={selectedCustomization}
              onChange={handleCustomizationChange}
            >
              <option value="">Select an option</option>
              {product.customizations.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        <button className="btn btn-green" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default ItemPopup;