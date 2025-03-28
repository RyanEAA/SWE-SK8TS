import React, { useEffect, useState } from 'react';
import OrderedItem from './OrderedItem';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/Order.css';

function Order({ orderItems, editable = false}) {
    const [productNames, setProductNames] = useState({});
    const [deliveryStatus, setDeliveryStatus] = useState(orderItems && orderItems.length > 0 ? orderItems[0].order_status : '');

    useEffect(() => {
        const fetchProductNames = async () => {
            try {
                const response = await axios.get('https://sk8ts-shop.com/api/products');
                if (response.status === 200 && Array.isArray(response.data)) {
                    const names = {};
                    response.data.forEach((product) => {
                        names[product.product_id] = product.name;
                    });
                    setProductNames(names);
                } else {
                    console.error('Error fetching products:', response);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProductNames();
    }, []); // Fetch products only once

    if (!orderItems || orderItems.length === 0) {
        return <div>No Orders</div>;
    }

    const handleDeliveryStatusChange = (event) => {
        // get needed information
        const newStatus = event.target.value;
        setDeliveryStatus(newStatus);
        const employeeID = Cookies.get('employee');

        if (editable) {
            axios.put(`https://sk8ts-shop.com/api/update-orders/${orderId}/${newStatus}/${employeeID}`)
            //axios.put(`http://localhost:3636/update-orders/${orderId}/${newStatus}/${employeeID}`)
                .then(response => {
                    console.log('Delivery status updated:', response);
                })
                .catch(error => {
                    console.error('Error updating delivery status:', error);
                    // Optionally, revert the local state if the update fails
                    // setDeliveryStatus(orderItems[0].order_status);
                });
            } else {
                console.log('employee_id cookies not found');
        }

    };

    const orderId = orderItems[0].order_id;
    const totalAmount = orderItems[0].total_amount;

    return (
        <div className='order'>
            <div className='ordered-items-header'>
                <h1>Order ID: {orderId}</h1>
                <h1>${totalAmount.toFixed(2)}</h1>
                {editable ? (
                    <select className='order-dropdown' value={deliveryStatus} onChange={handleDeliveryStatusChange}>
                        <option value="claimed">Claimed</option>
                        <option value="unclaimed">Unclaimed</option>
                        <option value="sent">Sent</option>
                    </select>
                ) : (
                    <h1>{deliveryStatus}</h1>
                )}
            </div>
            <div className='ordered-items-list'>
                {orderItems.map((item) => (
                    <OrderedItem key={item.product_id} item={item} productName={productNames[item.product_id]} />
                ))}
            </div>
        </div>
    );
}

export default Order;