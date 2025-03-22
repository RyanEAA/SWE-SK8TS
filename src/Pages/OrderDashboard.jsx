import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import '../css/OrderDashboard.css';

function OrderDashboard() {

    const [unclaimedOrders, setUnclaimedOrders] = useState(null);

    useEffect(() => {

        const fetchUnclaimedOrders = async () => {
            try {
                const response = await axios.get(`https://sk8ts-shop.com/api/unclaimed_orders`);
                if (response.status === 200 && Array.isArray(response.data)) {
                    setUnclaimedOrders(response.data);
                } else {
                    alert('Error retrieving unclaimed orders');
                }
            } catch (error) {
                console.error('Error fetching unclaimed orders:', error);
                alert('An error occurred while fetching unclaimed orders.');
            }
        };

        fetchUnclaimedOrders();
    });

    if (!unclaimedOrders) {
        return <div>Loading Unclaimed Orders...</div>;
    }

    return (
        <>
            <div className='unclaimed-orders-headers'>
                <div className='unclaimed-order-id'>Order ID </div>
                <div className='unclaimed-order-user-id'>User ID</div>
                <div className='unclaimed-order-price'>Price</div>
                <div></div>
            </div>
            {[...unclaimedOrders].reverse().map(order => (
                <div className='unclaimed-order-container'>
                    <div className='unclaimed-order-id'>{order.order_id} </div>
                    <div className='unclaimed-order-user-id'>{order.user_id}</div>
                    <div className='unclaimed-order-price'>{order.total_amount}</div>
                    <div className='unclaimed-order-claim'><button className='unclaimed-order-claim-button'>claim</button></div>
                </div>
            ))}
        </>
    );
}

export default OrderDashboard;
