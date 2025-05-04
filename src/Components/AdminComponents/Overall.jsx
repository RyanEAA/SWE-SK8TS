import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/admin/Admin.css';

import Order from '../../Components/Order'
import axios from 'axios';

import RecentPersonCard from '../../Components/RecentPersonCard';

function Overall() {
    const [claimedOrders, setClaimedOrders] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentEmployees, setRecentEmployees] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const navigate = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isLoading, setIsLoading] = useState({
        claimedOrders: true,
        users: true,
        employees: true,
        orders: true
    });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const employeeId = Cookies.get('user_id');
                const userRole = Cookies.get('user_role');
                
                if (!employeeId || (userRole !== 'employee' && userRole !== 'admin')) {
                    navigate('/login');
                    return;
                }

                setIsLoading(prev => ({...prev, claimedOrders: true, users: true, employees: true, orders: true}));
                
                // Fetch all data in parallel
                const responses = await Promise.all([
                    axios.get(`https://sk8ts-shop.com/api/orders/employee/${employeeId}`),
                    axios.get('https://sk8ts-shop.com/api/users/recent?limit=3'),
                    axios.get('https://sk8ts-shop.com/api/employees/active?limit=2'),
                    axios.get('https://sk8ts-shop.com/api/orders/recent?limit=5')
                ]);

                setClaimedOrders(responses[0].data);
                setRecentUsers(responses[1].data);
                setRecentEmployees(responses[2].data);
                setRecentOrders(responses[3].data);

            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to load data. Please try again later.');
            } finally {
                setIsLoading({
                    claimedOrders: false,
                    users: false,
                    employees: false,
                    orders: false
                });
            }
        };

        fetchAllData();
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
            {/* Claimed Orders */}
            {/* <div className='admin-section top-left claimed-orders-container'> */}
            <div className='admin-section top-left '>
                <h1>Claimed Orders</h1>
                {isLoading.claimedOrders ? (
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
                                        orderId={orderId}
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
            
            {/* Recently Registered Users */}
            <div className='admin-section top-right'>
                <h1>New Users</h1>
                {isLoading.users ? (
                    <div className="loading-spinner">Loading...</div>
                ) : (
                    <div className="recent-list">
                        {recentUsers.length > 0 ? (
                            recentUsers.map(user => (
                                <RecentPersonCard 
                                    key={user.user_id} 
                                    person={user} 
                                    type="user" 
                                />
                            ))
                        ) : (
                            <p className="no-data">No recent users found</p>
                        )}
                    </div>
                )}
            </div>
            
            {/* Recently Active Employees */}
            <div className='admin-section bottom-left'>
                <h1>Active Employees</h1>

                {isLoading.employees ? (
                    <div className="loading-spinner">Loading...</div>
                ) : (
                    <div className="recent-list">
                        {recentEmployees.length > 0 ? (
                            recentEmployees.map(employee => (
                                <RecentPersonCard 
                                    key={employee.user_id} 
                                    person={employee} 
                                    type="employee" 
                                />
                            ))
                        ) : (
                            <p className="no-data">No active employees found</p>
                        )}
                    </div>
                )}
            </div>
            
            {/* Recent Orders */}
            <div className='admin-section bottom-right'>
                <h1>Recent Orders</h1>
                {isLoading.orders ? (
                    <div className="loading-spinner">Loading...</div>
                ) : (
                    // ...existing code...
                    <div className="orders-list">
                        {recentOrders.length > 0 ? (
                            recentOrders.map(order => (
                                <div 
                                    key={order.order_id} 
                                    className="order-item"
                                    onClick={() => setSelectedOrder(order.order_id)}
                                >
                                    <Order 
                                        orderId={order.order_id}
                                        editable={false} 
                                    />
                                </div>
                            ))
                        ) : (
                            <p className="no-orders">No recent orders found</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Overall;