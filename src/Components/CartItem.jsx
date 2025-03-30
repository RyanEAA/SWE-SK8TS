import '../css/CartItem.css';
import React from 'react';
import { useDispatch } from 'react-redux';
import { addItem, removeItem } from '../CartSlice.js';
import '../css/buttons.css'
function CartItem(props) {


    // import dispatch
    const dispatch = useDispatch();

    const handleDecrement = () => {
        const productToRemove = props.item.product_id; // Send only the product_id
      
        if (props.item.quantity > 0) {
          dispatch(removeItem(productToRemove));
        }
      };
    
      const handleIncrement = () => {
        const productToAdd = {
          product_id: props.item.product_id,
          quantity: 1, // Or the appropriate quantity to add
          price: props.item.price,
          maxQuantity: props.item.maxQuantity, // Or rename to match your reducer
        };
        if (props.item.quantity < props.item.maxQuantity) {
          dispatch(addItem(productToAdd));
        }
      };

    return (
        <div className='container-container'>
            <div className="item-container">
                <img className='cart-item-image' src={`/Images/products/${props.item.image_path}`} alt={props.item.name} />
                <div>{props.item.product_name}</div>
                <div>${(props.item.price * props.item.quantity).toFixed(2)}</div>
                <div>
                    <button className="btn btn-green" onClick={ handleDecrement }>−</button> 
                    <div className="item-quantity">{props.item.quantity} </div>
                    <button className="btn btn-green" onClick={ handleIncrement }>+</button>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
