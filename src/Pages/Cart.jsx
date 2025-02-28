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
    // Check if user is logged in
    const user = Cookies.get('user');
    if (!user) {
      alert('You must be logged in to check out.');
      navigate('/login'); // Redirect to login page
      return;
    }

    // Check if shipping address is provided
    if (!shippingAddress) {
      alert('Please enter a shipping address.');
      return;
    }

    // Prepare order data
    const orderData = {
      user_id: user.id, // Assuming the user object has an `id` field
      total_amount: totalPrice,
      shipping_address: shippingAddress,
    };

    try {
      // Send POST request to the API
      const response = await fetch('https://sk8ts-shop.com/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      // Handle success
      alert('Order placed successfully!');
      // Optionally, clear the cart or redirect to a confirmation page
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
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