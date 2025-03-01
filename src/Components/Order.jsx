import React, { useEffect, useState } from 'react';
import OrderedItem from './OrderedItem';
import axios from 'axios';
import '../css/Order.css';

function Order({ orderItems }) {
    const [productNames, setProductNames] = useState({});

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

    const orderId = orderItems[0].order_id;
    const totalAmount = orderItems[0].total_amount;
    const deliveryStatus = orderItems[0].order_status;

    return (
        <div className='order'>
            <div className='ordered-items-header'>
                <h1>Order ID: {orderId}</h1>
                <h1>${totalAmount.toFixed(2)}</h1>
                <h1>{deliveryStatus}</h1>
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