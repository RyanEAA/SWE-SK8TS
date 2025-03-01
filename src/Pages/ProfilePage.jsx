import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/ProfilePage.css';
import Order from '../Components/Order';

function ProfilePage() {
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

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
                const response = await axios.get(`https://sk8ts-shop.com/api/orders/${userId}`);
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

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        Cookies.remove('user');
        window.location.href = '/';
        return;
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

    // Reverse the order of the grouped orders
    const reversedOrderIds = Object.keys(groupedOrders).sort((a, b) => b - a);

    return (
        <div>
            <div className='profile-container'>
                <div className='profile-header'>
                    <img src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?semt=ais_hybrid" alt="Profile" className='profile-image' />
                    <div className='profile-header-text'>
                        <h1 className='profile-name'>{userData.firstName} {userData.lastName}</h1>
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
                        </tbody>
                    </table>
                </div>
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div className='order-container'>
                {reversedOrderIds.map((orderId) => (
                    <Order key={orderId} orderItems={groupedOrders[orderId]} />
                ))}
            </div>
        </div>
    );
}

export default ProfilePage;