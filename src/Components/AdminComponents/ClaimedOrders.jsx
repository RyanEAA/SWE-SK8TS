import React, { useState, useEffect } from 'react';
import Order from '../Order';
import Cookies from 'js-cookie';
import '../../css/admin/Admin.css';

function ClaimedOrders() {
    const [isLoading, setIsLoading] = useState(true);
    const [claimedOrders, setClaimedOrders] = useState([]);
    const userId = Cookies.get('user_id');


    useEffect(() => {
        const fetchClaimedOrders = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`https://sk8ts-shop.com/api/orders/employee/${userId}`);
                const data = await response.json();
                console.log('Claimed orders data:', data); // Add this line
                setClaimedOrders(data);
            } catch (error) {
                console.log('Error fetching claimed orders:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClaimedOrders();



    }, []);
    return (
        <div className="admin-section">
        <h1>Claimed Orders</h1>
        {isLoading ? (
            <div className="loading-spinner">Loading...</div>
        ) : (
            <div className="recent-list">
            {claimedOrders.length > 0 ? (
                claimedOrders.map(order => (
                    <div 
                        key={order.order_id} 
                        className="order-item"
                        onClick={() => setSelectedOrder(order.order_id)}
                    >
                        <Order 
                            orderId={order.order_id}
                            editable={true} 
                        />
                    </div>
                ))
            ) : (
                <p>No claimed orders found</p>
            )}
        </div>
        )}
        </div>
    );
}

export default ClaimedOrders;