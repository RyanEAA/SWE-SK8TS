import CartItem from "../Components/CartItem.jsx"
import '../css/Cart.css'
// import { ORDEROBJECT } from "../OrderObject.js"
import { PRODUCTS } from '../Products.js'
import React, { useState } from 'react';





function Cart(props) {

    const itemsPrice = props.cartItems.reduce((a, c) => a + c.price * c.qty, 0)
    const taxPrice = itemsPrice * 0.08;

    const totalPrice = itemsPrice

    return (
      <>
        <div className="cart-labels-container">
          <div></div>
          <div>Name</div>
          <div>Price</div>
          <div>Quantity</div>
        </div>
        <div id="cart-item-container">
          {props.cartItems.length === 0 && <div>Cart Is Empty</div>}
          {props.cartItems.map((item) => (
            <CartItem item={item} onAdd={props.onAdd} onRemove={props.onRemove}/>
          ))}
        </div>
        <div>
          {props.cartItems.length != 0 && (
            <>
            <hr></hr>
            <div>Total Price: </div>
            <div>${itemsPrice.toFixed(2)}</div>
            </>
          )}
          <hr></hr>
          <button>Check Out</button>
        </div>
      </>
    )
  }
  
  export default Cart