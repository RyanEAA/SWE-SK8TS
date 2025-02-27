import '../css/CartItem.css';
import React from 'react';

function CartItem(props) {

    return (
        <div className='container-container'>
            <div className="item-container">
                <img className='cart-item-image' src={`./Images/products/${props.item.image_path}`} alt={props.item.name} />
                <div>{props.item.name}</div>
                <div>${(props.item.price * props.item.qty).toFixed(2)}</div>
                <div>
                    <button onClick={() => props.onRemove(props.item)}>dec</button> 
                    {props.item.qty} 
                    <button onClick={() => props.onAdd(props.item)}>inc</button>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
