import React, { useEffect, useState } from 'react';
import OrderedItem from './OrderedItem';
import OrderPopup from './OrderPopup';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/Order.css';

function Order({ orderItems, editable = false}) {
    const [productNames, setProductNames] = useState({});
    const [deliveryStatus, setDeliveryStatus] = useState(orderItems && orderItems.length > 0 ? orderItems[0].order_status : '');
    const [showPopup, setShowPopup] = useState(false);

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
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProductNames();
    }, []);

    if (!orderItems || orderItems.length === 0) {
        return <div>No Orders</div>;
    }

    const handleDeliveryStatusChange = (event) => {
        event.stopPropagation(); // Prevent triggering the order click
        const newStatus = event.target.value;
        setDeliveryStatus(newStatus);
        const employeeID = Cookies.get('user_id');

        if (editable && employeeID) {
            axios.put(`https://sk8ts-shop.com/api/update-orders/${orderId}/${newStatus}/${employeeID}`)
                .then(response => {
                    console.log('Delivery status updated:', response);
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error updating delivery status:', error);
                });
        }
    };

    const handleOrderClick = () => {
        const formattedItems = orderItems.map(item => ({
            productName: productNames[item.product_id],
            quantity: item.quantity,
            price: item.price,
            orderDate: new Date(item.order_date).toLocaleDateString(),
            status: item.order_status,
            shippingAddress: item.shipping_address,
            customization: item.customization || 'No customization',
            claimedBy: item.claimed_by
        }));
        setShowPopup(true);
    };

    const orderId = orderItems[0].order_id;
    const totalAmount = orderItems[0].total_amount;

    return (
        <>
            <div className='order' onClick={handleOrderClick}>
                <div className='ordered-items-header'>
                    <h1>Order ID: {orderId}</h1>
                    <h1>${totalAmount.toFixed(2)}</h1>
                    {editable ? (
                        <select 
                            className='order-dropdown' 
                            value={deliveryStatus} 
                            onChange={handleDeliveryStatusChange}
                            onClick={(e) => e.stopPropagation()} // Prevent triggering the order click
                        >
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
                        <OrderedItem 
                            key={`${item.product_id}-${item.customization}`} 
                            item={{
                                ...item,
                                customizations: item.customization ? JSON.parse(item.customization) : null
                            }}
                            productName={productNames[item.product_id]} 
                        />
                    ))}
                </div>
            </div>

            {showPopup && (
                <OrderPopup
                    orderId={orderId}
                    orderItems={orderItems.map(item => ({
                        productName: productNames[item.product_id],
                        quantity: item.quantity,
                        price: item.price,
                        orderDate: new Date(item.order_date).toLocaleDateString(),
                        status: item.order_status,
                        shippingAddress: item.shipping_address,
                        customization: item.customization || 'No customization',
                        claimedBy: item.claimed_by
                    }))}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </>
    );
}

export default Order;