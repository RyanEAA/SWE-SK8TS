// AllOrders.jsx
import Order from '../Order';
import React , { useState, useEffect } from 'react';
import '../../css/admin/Admin.css';

function AllOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://sk8ts-shop.com/api/orders/');
        const data = await response.json();
        setAllOrders(data);
      } catch (error) {
        console.log('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllOrders();
  }, []);


  return (
    <div className="admin-section">
      <h1>All Orders</h1>
      {isLoading.orders ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="orders-list scrollable-list">
          {allOrders.length > 0 ? (
            allOrders.map(order => (
              <div 
                key={order.order_id} 
                className="order-item"
                onClick={() => setSelectedOrder(order.order_id)}
              >
                <Order orderItems={[order]} editable={false} />
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
