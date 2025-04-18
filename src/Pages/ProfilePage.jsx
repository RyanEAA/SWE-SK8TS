import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/ProfilePage.css';
import '../css/buttons.css';
import Order from '../Components/Order';
import Popup from 'reactjs-popup';
import OrderPopup from '../Components/OrderPopup';
import Admin from './Admin';

function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [claimedOrders, setClaimedOrders] = useState([]);
    // Initialize activeTab from localStorage if it exists, default to 'placed'
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('activeTab') || 'placed';
    });
    const navigate = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Whenever activeTab changes, save it to localStorage
    useEffect(() => {
        localStorage.setItem('activeTab', activeTab);
    }, [activeTab]);

    useEffect(() => {
        const fetchUserData = async () => {
            const username = Cookies.get('user');
            if (!username) {
                alert('No user logged in. Redirecting to login.');
                window.location.href = '/login';
                return;
            }
            try {
                const response = await axios.get('https://sk8ts-shop.com/api/users');
                if (response.status === 200 && Array.isArray(response.data)) {
                    const user = response.data.find((u) => u.username === username);
                    if (user) {
                        setUserData(user);
                        fetchOrders(user.user_id);
                        if (user.user_role === 'admin' || user.user_role === 'employee') {
                            fetchClaimedOrders(user.user_id);
                        }
                    } else {
                        alert('User not found. Redirecting to login.');
                        window.location.href = '/login';
                    }
                } else {
                    alert('Error retrieving user data.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                alert('An error occurred while fetching user data.');
            }
        };

        const fetchOrders = async (userId) => {
            try {
                const response = await axios.get(`https://sk8ts-shop.com/api/orders/user/${userId}`);
                if (response.status === 200 && Array.isArray(response.data)) {
                    setOrders(response.data);
                } else {
                    alert('Error retrieving orders.');
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                alert('An error occurred while fetching orders.');
            }
        };

        const fetchClaimedOrders = async (employeeId) => {
            try {
                const response = await axios.get(`https://sk8ts-shop.com/api/orders/employee/${employeeId}`);
                //const response = await axios.get(`http://localhost:3636/orders/employee/${employeeId}`);
                if (response.status === 200 && Array.isArray(response.data)) {
                    setClaimedOrders(response.data);
                }
            } catch (error) {
                console.error('Error fetching claimed orders:', error);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleOrderClick = (orderId) => {
        setSelectedOrder(orderId);
    };

    const handleLogout = () => {
        Cookies.remove('user');
        Cookies.remove('user_role');
        window.location.href = '/';
    };

    if (!userData) {
        return <div>Loading user data...</div>;
    }

    // Group orders by order_id
    const groupedOrders = orders.reduce((acc, order) => {
        if (!acc[order.order_id]) {
            acc[order.order_id] = [];
        }
        acc[order.order_id].push(order);
        return acc;
    }, {});

    const groupedClaimedOrders = claimedOrders.reduce((acc, order) => {
        if (!acc[order.order_id]) {
            acc[order.order_id] = [];
        }
        acc[order.order_id].push(order);
        return acc;
    }, {});

    // Reverse the order of the grouped orders
    const reversedOrderIds = Object.keys(groupedOrders).sort((a, b) => b - a);
    const reversedClaimedOrderIds = Object.keys(groupedClaimedOrders).sort((a, b) => b - a);

    const isEmployee = userData.user_role === 'employee';
    const isAdmin = userData.user_role === 'admin'; // just in case we need to check for admin specifically


    return (
        <div className="profile-page-container">
            <div className="profile-section">
                <div className='profile-header'>
                    <img src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?semt=ais_hybrid" 
                         alt="Profile" 
                         className='profile-image' />
                    <div className='profile-header-text'>
                        <h1 className='profile-name'>{userData.first_name} {userData.last_name}</h1>
                    </div>
                </div>
                <div className='profile-details'>
                    <table>
                        <tbody>
                            <tr>
                                <td className='profile-details'>Username</td>
                                <td>{userData.username}</td>
                            </tr>
                            <tr>
                                <td className='profile-details'>First Name</td>
                                <td>{userData.first_name}</td>
                            </tr>
                            <tr>
                                <td className='profile-details'>Last Name</td>
                                <td>{userData.last_name}</td>
                            </tr>
                            <tr>
                                <td className='profile-details'>Email</td>
                                <td>{userData.email}</td>
                            </tr>
                            <tr>
                                <td className='profile-details'>Shipping Address</td>
                                <td>{userData.shipping_address}</td>
                            </tr>
                            <tr>
                                <td className='profile-details'>Role</td>
                                <td>{userData.user_role}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>

            {isAdmin ? (
            <div className='admin-section'>
                <Admin />
            </div>
        ) : (
            <div className="orders-section">
                <div className="orders-tabs">
                    <button 
                        className={`btn-tab ${activeTab === 'placed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('placed')}
                    >
                        Order History
                    </button>
                    {isEmployee && (
                        <button 
                            className={`btn-tab ${activeTab === 'claimed' ? 'active' : ''}`}
                            onClick={() => setActiveTab('claimed')}
                        >
                            Claimed Orders
                        </button>
                    )}
                </div>
                
                <div className="orders-container">
                    {activeTab === 'placed' ? (
                        reversedOrderIds.length > 0 ? (
                            reversedOrderIds.map((orderId) => (
                                <button 
                                    key={orderId}
                                    className="btn btn-white"
                                >
                                    <Order orderItems={groupedOrders[orderId]} editable={false} />
                                </button>
                            ))
                        ) : (
                            <p className="no-orders">No orders placed yet</p>
                        )
                    ) : (
                        reversedClaimedOrderIds.length > 0 ? (
                            reversedClaimedOrderIds.map((orderId) => (
                                <button
                                    key={orderId}
                                    className="btn btn-white"
                                >
                                    <Order orderItems={groupedClaimedOrders[orderId]} editable={true} />
                                </button>
                            ))
                        ) : (
                            <p className="no-orders">No orders claimed yet</p>
                        )
                    )}
                </div>
            </div>
        )}
            <OrderPopup 
                orderId={selectedOrder}
                orderItems={[]} // Pass your order items array here
                onClose={() => setSelectedOrder(null)}
            />
        </div>
    );
}

export default ProfilePage;
