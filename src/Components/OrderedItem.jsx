import React from 'react';
import '../css/OrderedItem.css';

function OrderedItem({ item, productName }) {
    // If no product name or ID, don't render anything
    if (!productName && !item?.product_id) return null;
    
    // If no quantity or invalid quantity, don't show quantity text
    const quantityDisplay = item?.quantity ? `Qty: ${item.quantity}` : null;

    return (
        <div className='ordered-item'>
            <div className='item-name'>
                {productName || `Product ID: ${item.product_id}`}
            </div>
            {quantityDisplay && (
                <div className='item-price'>{quantityDisplay}</div>
            )}
        </div>
    );
}

export default OrderedItem;