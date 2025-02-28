import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting
import Cookies from 'js-cookie'; // For checking login status
import CartItem from '../Components/CartItem.jsx';
import '../css/Cart.css';

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
        {cartItems.length !== 0 && (
          <>
            <hr />
            <div>Total Price: ${itemsPrice.toFixed(2)}</div>
            <div>Tax (8%): ${taxPrice.toFixed(2)}</div>
            <div>Total with Tax: ${totalPrice.toFixed(2)}</div>
          </>
        )}
        <hr />
        {/* Add shipping address input */}
        <input
          type="text"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Shipping Address"
          required
        />
        <button onClick={handleCheckout}>Check Out</button>
      </div>
    </>
  );
}

export default Cart;