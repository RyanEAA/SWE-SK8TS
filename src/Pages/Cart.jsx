import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import CartItem from '../Components/CartItem.jsx';
import '../css/Cart.css';
import axios from 'axios';
import { useSelector } from 'react-redux';


function Cart() {
  const navigate = useNavigate();
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


  // 
  const handleCheckout = async () => {
    if (!userData) { // if user isn't logged in 
      alert('You must be logged in to check out.');
      return;
    }
    if (cartItems.length === 0) { // if users cart is empty
      alert('Cart is empty');
      return;
    }
    if (!address) {
      alert('Please enter a shipping address');
      return;
    }
    // if all checks pass, place order
    console.log('placing checkout');

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
          console.log('item price:', item.price ),
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
        <button onClick={handleCheckout}>Check Out</button>
      </div>
    </>
  );
}

export default Cart;