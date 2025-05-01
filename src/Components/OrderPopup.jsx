import React from 'react';
import '../css/OrderPopup.css';

function OrderPopup({ orderId, orderItems, onClose }) {
    if (!orderId || !orderItems) {
        return null;
    }

    const firstItem = orderItems[0];

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                
                <div className="order-info">
                    <h3>Order Details</h3>
                    <p><strong>Order ID:</strong> {orderId}</p>
                    <p><strong>Order Date:</strong> {firstItem.orderDate}</p>
                    <p><strong>Status:</strong> {firstItem.status}</p>
                    <p><strong>Shipping Address:</strong> {firstItem.shippingAddress}</p>
                    {firstItem.claimedBy && (
                        <p><strong>Claimed By:</strong> Employee #{firstItem.claimedBy}</p>
                    )}
                </div>

                <div className="order-items">
                    <h4>Items</h4>
                    {orderItems.map((item, index) => (
                        <div key={index} className="order-item">
                            <div className="product-name">{item.productName}</div>
                            <div>Quantity: {item.quantity}</div>
                            <div>${item.price.toFixed(2)}</div>
                            {item.customization && item.customization !== 'No customization' && (
                                <div className="notes">
                                    Customization: {item.customization}
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="order-total">
                        <h4>Total: ${orderItems.reduce((sum, item) => 
                            sum + (item.price * item.quantity), 0).toFixed(2)}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderPopup;