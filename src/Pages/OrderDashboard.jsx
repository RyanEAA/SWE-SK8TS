import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import '../css/OrderDashboard.css';

function OrderDashboard() {

    const [unclaimedOrders, setUnclaimedOrders] = useState(null);

    const handleClaimOrder = async (order_id) => {
        console.log('Claiming order:', order_id);
        console.log('Employee:', Cookies.get('employee'));

        try {
            const response = await axios.put(`https://sk8ts-shop.com/api/orders/${order_id}/status`, {
                order_status: 'In Progress',
                order_id: order_id
            });

            if (response.status === 200) {
                alert('Order claimed successfully.');
            } else {
                alert('Error claiming order.');
            }
        }
        catch (error) {
            console.error('Error claiming order:', error);
            alert('An error occurred while claiming order.');
        }
    }

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
                // alert('An error occurred while fetching unclaimed orders.');
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
                <div className='unclaimed-order-price'>Order Date</div>
                <div></div>
            </div>
            {[...unclaimedOrders].reverse().map(order => (
                <div className='unclaimed-order-container'>
                    <div className='unclaimed-order-id'>{order.order_id} </div>
                    <div className='unclaimed-order-user-id'>{order.user_id}</div>
                    <div className='unclaimed-order-price'>{order.order_date}</div>
                    <div className='unclaimed-order-claim'><button onClick={() => handleClaimOrder(order.order_id)} className='unclaimed-order-claim-button'>claim</button></div>
                </div>
            ))}
        </>
    );
}

export default OrderDashboard;
