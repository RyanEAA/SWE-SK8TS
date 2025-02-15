import '../css/CartItem.css'
import React, { useState } from 'react';

function CartItem(props) {
    console.log(props.item)
    return (
    <div className='container-container'>
      <div className="item-container">
        {/* <img className='cart-item-image' src={props.item.image}></img>
        <h3 className='cart-item-info'>id:{props.item.id} {props.item.name} ${(props.item.price * props.item.qty).toFixed(2)} Quantity: <button onClick={() => props.onRemove(props.item)}>dec</button> {props.item.qty} <button onClick={() => props.onAdd(props.item)}>inc</button></h3> */}
        {/* <div>id:{props.item.id}</div> */}
        <img className='cart-item-image' src={props.item.image}></img>
        <div className='prod-att-container'>{props.item.name}</div>
        <div className='prod-att-container'>${(props.item.price * props.item.qty).toFixed(2)}</div>
        <div className='prod-att-container'><button className='dec-btn' onClick={() => props.onRemove(props.item)}>dec</button> {props.item.qty} <button className='inc-btn' onClick={() => props.onAdd(props.item)}>inc</button></div>
        {/* <div><button onClick={() => props.onRemove(props.item)}>dec</button></div>
        <div><button onClick={() => props.onAdd(props.item)}>inc</button></div> */}
      </div>
    </div>
    )
  }
  
  export default CartItem