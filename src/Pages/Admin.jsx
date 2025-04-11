import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/admin/Admin.css';
import Order from '../Components/Order';
import axios from 'axios';

function Admin() {
    const [claimedOrders, setClaimedOrders] = useState([]);
    const navigate = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClaimedOrders = async () => {
            try {
                const employeeId = Cookies.get('user_id');
                const userRole = Cookies.get('user_role');
                
                if (!employeeId || (userRole !== 'employee' && userRole !== 'admin')) {
                    navigate('/login');
                    return;
                }

                setIsLoading(true);
                const response = await axios.get(`https://sk8ts-shop.com/api/orders/employee/${employeeId}`);
                
                if (response.status === 200 && Array.isArray(response.data)) {
                    setClaimedOrders(response.data);
                } else {
                    console.error('Unexpected response format:', response);
                }
            } catch (error) {
                console.error('Error fetching claimed orders:', error);
                alert('Failed to load claimed orders. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchClaimedOrders();
    }, [navigate]);

    // Group and sort orders
    const groupedClaimedOrders = claimedOrders.reduce((acc, order) => {
        if (!acc[order.order_id]) {
            acc[order.order_id] = [];
        }
        acc[order.order_id].push(order);
        return acc;
    }, {});

    const reversedClaimedOrderIds = Object.keys(groupedClaimedOrders).sort((a, b) => b - a);

    return (
        <div className='admin-page'>
            <div className='admin-section top-left claimed-orders-container'>
                <h1>Claimed Orders</h1>
                {isLoading ? (
                    <div className="loading-spinner">Loading...</div>
                ) : (
                    <div className="orders-list">
                        {reversedClaimedOrderIds.length > 0 ? (
                            reversedClaimedOrderIds.map((orderId) => (
                                <div 
                                    key={orderId} 
                                    className="order-item"
                                    onClick={() => setSelectedOrder(orderId)}
                                >
                                    <Order 
                                        orderItems={groupedClaimedOrders[orderId]} 
                                        editable={true} 
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="no-orders">No orders claimed yet</p>
                        )}
                    </div>
                )}
            </div>
            
            {/* Other admin sections remain unchanged */}
            <div className='admin-section top-right'>
                <h1>User Management</h1>
                <p>Manage user accounts and permissions</p>
            </div>
            
            <div className='admin-section bottom-left'>
                <h1>Recently Active Employees</h1>
                <p>View recent employee activity</p>
            </div>
            
            <div className='admin-section bottom-right'>
                <h1>Recent Orders</h1>
                <p>Here's where recent orders will show up</p>
            </div>
        </div>
    );
}

export default Admin;