import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/OrderDashboard.css';
import '../css/buttons.css'

function OrderDashboard() {
    const [unclaimedOrders, setUnclaimedOrders] = useState(null);
    const navigate = useNavigate();
    
    // only allow employees and admins to access this page
      useEffect(() => {
        const fetchUserData = async () => {
          const username = Cookies.get('user');
          if (!username) {
            alert('You must be a logged in employee to check out.');
            window.location.href = '/login';
            return;
          }
    
          try {
            const response = await axios.get('https://sk8ts-shop.com/api/users');
            if (response.status === 200 && Array.isArray(response.data)) {
              const user = response.data.find((u) => u.username === username);
              if (user.user_role !== 'employee' || user.user_role !== 'admin') {
                alert('You must be an employee or admin to access this page.');
                window.location.href = '/login';
              }
              if (user) {
                setUserData(user);
              } else {
                alert('User not found. Redirecting to login.');
                window.location.href = '/login';
              }
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            alert('An error occurred while fetching user data.');
          } finally {
            setLoading(false);
          }
        };
    
        fetchUserData();
      }, [navigate]);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
        };
        return date.toLocaleDateString('en-US', options);
    }

    const handleClaimOrder = async (order_id) => {
        const employeeId = Cookies.get('employee');
        const orderStatus = 'claimed';
      
        console.log('Claiming order:', order_id);
        console.log('Employee:', employeeId);
      
        try {
            const response = await axios.put(
                `https://sk8ts-shop.com/api/update-orders/${order_id}/${orderStatus}/${employeeId}`
            );
      
            if (response.status === 200) {
                alert('Order claimed successfully.');
            } else {
                alert('Error claiming order. Server returned a non 200 status.');
            }
        } catch (error) {
            console.error('Error claiming order:', error);
            if (error.response && error.response.data) {
                console.error('Server response:', error.response.data);
            }
            alert('An error occurred while claiming order.');
        }
        window.location.reload();
    };
      
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
            }
        };

        fetchUnclaimedOrders();
    }, []);

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
            {[...unclaimedOrders].map(order => (
                <div className='unclaimed-order-container' key={order.order_id}>
                    <div className='unclaimed-order-id'>{order.order_id} </div>
                    <div className='unclaimed-order-user-id'>{order.user_id}</div>
                    <div className='unclaimed-order-price'>{formatDate(order.order_date)}</div>
                    <div className='unclaimed-btn-claim'><button onClick={() => handleClaimOrder(order.order_id)} className="btn btn-green" >Claim Order</button></div>
                </div>
            ))}
        </>
    );
}

export default OrderDashboard;