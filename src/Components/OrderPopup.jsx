import React from 'react';
import Popup from 'reactjs-popup';

const OrderPopup = ({ orderId, orderItems, onClose }) => {
  return (
    <Popup open={orderId !== null} onClose={onClose}>
      <div className="order-popup">
        {/* Your popup content will go here */}
        <h3>Order Details for #{orderId}</h3>
        <button className="btn btn-green" onClick={onClose}>Close</button>
      </div>
    </Popup>
  );
};

export default OrderPopup;