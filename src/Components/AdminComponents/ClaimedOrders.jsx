import React, { useState, useEffect } from 'react';
import Order from '../Order';

function ClaimedOrders() {
    const [isLoading, setIsLoading] = useState(true);
    const [claimedOrders, setClaimedOrders] = useState([]);

    useEffect(() => {
        const fetchClaimedOrders = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`https://sk8ts-shop.com/api/orders/user/${userId}`);
                const data = await response.json();
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
        <div className="claimed-orders">
        <h1>Claimed Orders</h1>
        {isLoading ? (
            <div className="loading-spinner">Loading...</div>
        ) : (
            <div className="claimed-orders-list">
                {claimedOrders.length > 0 ? (
                    claimedOrders.map(order => (
                        <div 
                key={order.order_id} 
                className="order-item"
                onClick={() => setSelectedOrder(order.order_id)}
              >
                <Order orderItems={[order]} editable={true} />
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