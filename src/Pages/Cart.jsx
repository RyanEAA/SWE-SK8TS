import CartItem from "../Components/CartItem.jsx";
import '../css/Cart.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

function Cart({ cartItems, onAdd, onRemove }) {
  const itemsPrice = cartItems.reduce((a, c) => a + c.price * c.qty, 0);
  const taxPrice = itemsPrice * 0.08;
  const totalPrice = itemsPrice + taxPrice;

  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  
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

    try {
      const response = await fetch('https://sk8ts-shop.com/api/addorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userData.user_id,
          total_amount: totalPrice,
          shipping_address: 'testing',
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
        <form onSubmit={handleSubmit}>
          <button type='submit'>Check Out</button>
        </form>
      </div>
    </>
  );
}

export default Cart;
