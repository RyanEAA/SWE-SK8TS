import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import CartItem from '../Components/CartItem.jsx';
import '../css/Cart.css';
import axios from 'axios';

function Cart({ cartItems, onAdd, onRemove }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);

  // Price calculations
  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.qty, 0);
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

  const makeCartList = () => {
    return cartItems.map(item => ({
      quantity: item.qty,
      price: item.price,
      product_id: item.product_id
    }));
  };

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
      // Create main order
      const orderResponse = await fetch('https://sk8ts-shop.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userData.user_id,
          order_date: new Date().toISOString(),
          total_amount: totalPrice,
          shipping_address: address,
          order_status: 'In Progress'
        })
      });

      // Handle order response
      const responseText = await orderResponse.text();
      console.log('Raw response:', responseText);

      if (!orderResponse.ok) {
        let errorMessage = `Failed to place order: ${orderResponse.status} ${orderResponse.statusText}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          errorMessage = responseText;
        }
        throw new Error(errorMessage);
      }

      // Parse successful order response
      const orderData = JSON.parse(responseText);
      
      // Add order items
      const cartItemsList = makeCartList();
      for (const item of cartItemsList) {
        const itemResponse = await fetch('https://sk8ts-shop.com/api/additems', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: orderData.orderId,
            quantity: item.quantity,
            price: item.price * item.quantity,
            product_id: item.product_id
          })
        });

        if (!itemResponse.ok) {
          throw new Error('Failed to add order items');
        }
      }

      alert('Order placed successfully!');
      console.log('Order ID:', orderData.orderId);
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.message || 'Failed to place order. Please try again.');
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
          <CartItem 
            key={item.product_id} 
            item={item} 
            onAdd={onAdd} 
            onRemove={onRemove} 
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
        <button onClick={handleCheckout}>Check Out</button>
      </div>
    </>
  );
}

export default Cart;