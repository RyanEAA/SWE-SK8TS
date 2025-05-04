import React, { useState, useEffect } from 'react';
import Order from '../Order';
import '../../css/admin/Admin.css';

function AllOrders() {
    const [isLoading, setIsLoading] = useState(true);
    const [allOrders, setAllOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('https://sk8ts-shop.com/api/orders');
                const data = await response.json();
                
                // Remove JSON parsing since customization is already a string
                const ordersWithCustomizations = data.map(order => ({
                    ...order,
                    customization: order.customization || null
                }));

                console.log('All orders data:', ordersWithCustomizations); // Add this line
                
                setAllOrders(ordersWithCustomizations);
            } catch (error) {
                console.error('Error fetching all orders:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllOrders();
    }, []);

    // Group orders by order_id if they're not already grouped
    const groupedOrders = allOrders.reduce((acc, order) => {
        if (!acc[order.order_id]) {
            acc[order.order_id] = [];
        }
        acc[order.order_id].push(order);
        return acc;
    }, {});

    return (
        <div className="all-orders">
            <h1>All Orders</h1>
            {isLoading ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <div className="all-orders-list scrollable-list">
                    {Object.keys(groupedOrders).length > 0 ? (
                        Object.keys(groupedOrders).map(orderId => (
                            <div 
                                key={orderId} 
                                className="order-item"
                                onClick={() => setSelectedOrder(orderId)}
                            >
                                <Order 
                                    orderId={orderId}
                                    editable={false} 
                                />
                            </div>
                        ))
                    ) : (
                        <p>No orders found</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default AllOrders;