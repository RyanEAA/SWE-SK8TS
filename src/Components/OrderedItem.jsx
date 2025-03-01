import React from 'react';
import '../css/OrderedItem.css';

function OrderedItem({ item, productName }) {
    return (
            <div className='ordered-item'>
                <div className='item-name'>{productName || `Product ID: ${item.product_id}`}</div>
                <div className='item-price'>{item.quantity}</div>
            </div>
    );
}

export default OrderedItem;