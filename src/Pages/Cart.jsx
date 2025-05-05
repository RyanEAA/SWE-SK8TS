import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import CartItem from '../Components/CartItem.jsx';
import '../css/Cart.css';
import '../css/buttons.css'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../CartSlice.js' // Import the clearCart action;

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  // Get cart items from redux
  const cartItems = useSelector((state) => state.cart.items);
  console.log('cart items in cart:', cartItems);

  // Price calculations
  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);
  const taxPrice = itemsPrice * 0.08;
  const totalPrice = itemsPrice + taxPrice;

  useEffect(() => {
    const fetchUserData = async () => {
      const username = Cookies.get('user');
      if (!username) {
        alert('You must be logged in to check out.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('https://sk8ts-shop.com/api/users');
        if (response.status === 200 && Array.isArray(response.data)) {
          const user = response.data.find((u) => u.username === username);
          if (user) {
            setUserData(user);
          } else {
            alert('User not found. Redirecting to login.');
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('An error occurred while fetching user data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleCheckout = async () => {
    if (!userData) {
      alert('You must be logged in to check out.');
      return;
    }
    if (cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }
    if (!address) {
      alert('Please enter a shipping address');
      return;
    }
  
    try {
      // 1. First fetch current stock for all products
      const stockCheckPromises = cartItems.map(item => 
        axios.get(`https://sk8ts-shop.com/api/products/1`)
      );
      const stockResponses = await Promise.all(stockCheckPromises);
      
      // 2. Verify stock quantities
      const insufficientStockItems = cartItems.filter((item, index) => {
        const currentStock = stockResponses[index].data.stock_quantity;
        return item.quantity > currentStock;
      });
  
      if (insufficientStockItems.length > 0) {
        const itemNames = insufficientStockItems.map(i => i.product_name).join(', ');
        alert(`Insufficient stock for: ${itemNames}`);
        return;
      }
  
      // 3. Place the order
      const orderData = {
        user_id: userData.user_id,
        total_amount: parseFloat(totalPrice.toFixed(2)),
        shipping_address: address.trim(),
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: parseFloat(item.price.toFixed(2)),
          customization: JSON.stringify(item.customizations || []),
        })),
      };
  
      const orderResponse = await axios.post('https://sk8ts-shop.com/api/placeOrder', orderData, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (orderResponse.status === 201) {
        // 4. Update stock quantities
        try {
          const updatePromises = cartItems.map((item, index) => {
            const currentStock = stockResponses[index].data.stock_quantity;
            const newStock = currentStock - item.quantity;
            
            console.log(`Updating product ${item.product_id} stock from ${currentStock} to ${newStock}`);
            
            return axios.put(`https://sk8ts-shop.com/api/products/1`, {
              name: stockResponses[index].data.name,
              price: stockResponses[index].data.price,
              stock_quantity: newStock,
              description: stockResponses[index].data.description,
              category_id: stockResponses[index].data.category_id,
              brand_id: stockResponses[index].data.brand_id,
              sku: stockResponses[index].data.sku,
              weight: stockResponses[index].data.weight,
              dimensions: stockResponses[index].data.dimensions,
              color: stockResponses[index].data.color,
              size: stockResponses[index].data.size,
              status: stockResponses[index].data.status,
              customizations: stockResponses[index].data.customizations
            }, {
              headers: { 'Content-Type': 'application/json' }
            });
          });
  
          await Promise.all(updatePromises);
          console.log('All stock updates completed successfully');
          
          // 5. Clear cart and redirect
          dispatch(clearCart());
          alert('Order placed successfully!');
          navigate('/');
        } catch (updateError) {
          console.error('Stock update error:', updateError);
          alert('Order was placed but stock update failed. Please contact support.');
        }
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      if (error.response?.data) {
        alert(`Error: ${error.response.data.message || 'Failed to place order'}`);
      } else {
        alert('An error occurred during checkout. Please try again.');
      }
    }
  };

  if (loading) {
    return <div>Loading user data...</div>;
  }

  return (
    <>
      <div className="cart-labels-container">
        <div></div>
        <div>Name</div>
        <div>Price</div>
        <div>Quantity</div>
      </div>
      <div id="cart-item-container">
        {cartItems.length === 0 && <div>Cart Is Empty</div>}
        {cartItems.map((item) => (
          console.log('item price:', item.price),
          <CartItem 
            key={item.product_id} 
            item={item} 
          />
        ))}
      </div>
      <div>
        <div>
          <input 
            type="text"
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            placeholder="Shipping Address" 
            required
          />
        </div>
        {cartItems.length !== 0 && (
          <>
            <hr />
            <div>Total Price: ${itemsPrice.toFixed(2)}</div>
            <div>Tax (8%): ${taxPrice.toFixed(2)}</div>
            <div>Total with Tax: ${totalPrice.toFixed(2)}</div>
          </>
        )}
        <hr />
        <button className="btn btn-green btn-checkout" onClick={handleCheckout}>Check Out</button>
      </div>
    </>
  );
}

export default Cart;
