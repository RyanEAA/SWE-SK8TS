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
        <button>Check Out</button>
      </div>
    </>
  );
}

export default Cart;
