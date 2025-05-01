import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/ProfilePage.css';
import '../css/buttons.css';
import Order from '../Components/Order';
import OrderPopup from '../Components/OrderPopup';
import Admin from './Admin';

function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [allOrders, setAllOrders] = useState([]);
    const navigate = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrderItems, setSelectedOrderItems] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = Cookies.get('user_id');
            const userRole = Cookies.get('user_role');

            if (!userId || !userRole) {
                alert('No user logged in. Redirecting to login.');
                window.location.href = '/login';
                return;
            }

            try {
                const response = await axios.get('https://sk8ts-shop.com/api/users');
                if (response.status === 200 && Array.isArray(response.data)) {
                    const user = response.data.find((u) => u.user_id === parseInt(userId));
                    if (user) {
                        setUserData(user);
                        fetchAllUserOrders(userId, userRole);
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

        fetchUserData();
    }, [navigate]);

    const fetchAllUserOrders = async (userId, userRole) => {
        try {
            let response;
            if (userRole === 'admin') {
                response = await axios.get('https://sk8ts-shop.com/api/orders');
            } else {
                response = await axios.get(`https://sk8ts-shop.com/api/orders/user/${userId}`);
            }
            
            if (response.status === 200 && Array.isArray(response.data)) {
                setAllOrders(response.data);
            } else {
                alert('Error retrieving orders.');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('An error occurred while fetching orders.');
        }
    };

    const handleOrderClick = (orderId, orderItems) => {
        // const formattedItems = orderItems.map(item => ({
        //     productName: item.product_name,
        //     quantity: item.quantity,
        //     price: item.price,
        //     orderDate: new Date(item.order_date).toLocaleDateString(),
        //     status: item.order_status, // Fixed: Changed from item.status to item.order_status
        //     shippingAddress: item.shipping_address,
        //     customization: item.customization || 'No customization',
        //     claimedBy: item.claimed_by
        // }));
        
        // setSelectedOrder(orderId);
        // setSelectedOrderItems(formattedItems);
    };

    const handleLogout = () => {
        Cookies.remove('user');
        Cookies.remove('user_role');
        Cookies.remove('user_id');
        window.location.href = '/';
    };

    const groupAllOrders = (orders) => {
        return orders.reduce((acc, order) => {
            if (!acc[order.order_id]) {
                acc[order.order_id] = [];
            }
            acc[order.order_id].push(order);
            return acc;
        }, {});
    };

    if (!userData) {
        return <div>Loading user data...</div>;
    }

    const isEmployee = userData.user_role === 'employee';
    const isAdmin = userData.user_role === 'admin';
    const currentUserId = parseInt(Cookies.get('user_id'));

    return (
        <div className="profile-page-container">
            <div className="profile-section">
                <div className="profile-header">
                    <img
                        src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?semt=ais_hybrid"
                        alt="Profile"
                        className="profile-image"
                    />
                    <div className="profile-header-text">
                        <h1 className="profile-name">
                            {userData.first_name} {userData.last_name}
                        </h1>
                    </div>
                </div>
                <div className="profile-details">
                    <table>
                        <tbody>
                            <tr>
                                <td className="profile-details">Username</td>
                                <td>{userData.username}</td>
                            </tr>
                            <tr>
                                <td className="profile-details">First Name</td>
                                <td>{userData.first_name}</td>
                            </tr>
                            <tr>
                                <td className="profile-details">Last Name</td>
                                <td>{userData.last_name}</td>
                            </tr>
                            <tr>
                                <td className="profile-details">Email</td>
                                <td>{userData.email}</td>
                            </tr>
                            <tr>
                                <td className="profile-details">Shipping Address</td>
                                <td>{userData.shipping_address}</td>
                            </tr>
                            <tr>
                                <td className="profile-details">Role</td>
                                <td>{userData.user_role}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button onClick={handleLogout} className="btn-logout">
                    Logout
                </button>
            </div>

            {isAdmin ? (
                <div className="admin-section">
                    <Admin />
                </div>
            ) : (
                <div className="orders-section">
                    <h2>Order History</h2>
                    <div className="orders-container">
                        {allOrders.length > 0 ? (
                            Object.entries(groupAllOrders(allOrders))
                                .sort(([a], [b]) => b - a)
                                .map(([orderId, orderItems]) => (
                                    <button 
                                        key={orderId} 
                                        className="btn btn-white"
                                        onClick={() => handleOrderClick(orderId, orderItems)}
                                    >
                                        <Order 
                                            orderItems={orderItems} 
                                            editable={isEmployee && orderItems[0].claimed_by === currentUserId}
                                        />
                                    </button>
                                ))
                        ) : (
                            <p className="no-orders">No orders found</p>
                        )}
                    </div>
                </div>
            )}
            
            <OrderPopup
                orderId={selectedOrder}
                orderItems={selectedOrderItems}
                onClose={() => {
                    setSelectedOrder(null);
                    setSelectedOrderItems(null);
                }}
            />
        </div>
    );
}

export default ProfilePage;