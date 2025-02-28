import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting
import Cookies from 'js-cookie'; // For checking login status
import CartItem from '../Components/CartItem.jsx';
import '../css/Cart.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function Cart({ cartItems, onAdd, onRemove }) {
  const [shippingAddress, setShippingAddress] = useState('');
  const navigate = useNavigate();

  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.qty, 0);
  const taxPrice = itemsPrice * 0.08;
  const totalPrice = itemsPrice + taxPrice;

  const handleCheckout = async () => {
    const user = Cookies.get('user');
    if (!user) {
      alert('You must be logged in to check out.');
      navigate('/login');
      return;
    }
  
    if (!shippingAddress) {
      alert('Please enter a shipping address.');
      return;
    }
  
    const orderData = {
      user_id: "usertest",
      order_date: new Date().toISOString(),
      total_amount: totalPrice,
      shipping_address: shippingAddress,
    };
  
    try {
      const response = await fetch('https://sk8ts-shop.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
  
      // Read the response body only once
      const responseText = await response.text(); // Get raw response text
      console.log('Raw response:', responseText); // Log raw response
  
      if (!response.ok) {
        // If the response is not OK, try to parse it as JSON (if it's JSON)
        let errorMessage = `Failed to place order: ${response.status} ${response.statusText}`;
        try {
          const errorData = JSON.parse(responseText); // Try to parse as JSON
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // If it's not JSON, use the raw text as the error message
          errorMessage = responseText;
        }
        throw new Error(errorMessage);
      }
  
      // If the response is OK, parse it as JSON
      const responseData = JSON.parse(responseText); // Parse JSON
      alert('Order placed successfully!');
      console.log('Order ID:', responseData.orderId); // Log order ID
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.message || 'Failed to place order. Please try again.');
    }
  };

  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [address, setAddress] = useState('')
  
  function MakeCartList(){
    const l = []
    for (let i = 0; i < cartItems.length; i++) {
      l.push([cartItems[i].qty, cartItems[i].price, cartItems[i].product_id])
    }
    return l
  }

  useEffect(() => {
    const fetchUserData = async () => {
        const username = Cookies.get('user');
        if (!username) {
            alert('No user logged in. Redirecting to login.');
            window.location.href = '/login';
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
                    window.location.href = '/login';
                }
            } else {
                alert('Error retrieving user data.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('An error occurred while fetching user data.');
        }
    };
    
    fetchUserData();
}, [navigate]);

if (!userData) {
  return <div>Loading user data...</div>;
}

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');

    if (MakeCartList().length == 0) {
      alert('Cart Empty')
      return
    }

    if (address == ''){
      alert('Enter Shipping Address')
      return
    }

    try {
      const response = await fetch('https://sk8ts-shop.com/api/addorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userData.user_id,
          total_amount: totalPrice,
          shipping_address: address,
          order_status: 'In Progress'
        })
      });
      const data = await response.json();
      const listToAdd = MakeCartList()
      for (let i = 0; i < listToAdd.length; i++) {
        const response2 = await fetch('https://sk8ts-shop.com/api/additems', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: data.orderId,
            quantity: listToAdd[i][0],
            price: listToAdd[i][1]*listToAdd[i][0],
            product_id: listToAdd[i][2]
          })
        });
      }
    } catch (error) {
        setMessage('Order Failed');
        console.error('Order Error:', error);
    }
    alert('Order Submited')



  };

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
          <CartItem key={item.product_id} item={item} onAdd={onAdd} onRemove={onRemove} />
        ))}
      </div>
      <div>
        <div>
          <input 
            type="text"
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            placeholder="Shipping Address" 
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
        <button>Check Out</button>
      </div>
    </>
  );
}

export default Cart;