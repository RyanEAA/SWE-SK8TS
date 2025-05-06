import React, { useEffect, useState } from 'react';
import OrderedItem from './OrderedItem';
import OrderPopup from './OrderPopup';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/Order.css';

function Order({ orderId, editable = false }) {
    const [orderItems, setOrderItems] = useState([]);
    const [productNames, setProductNames] = useState({});
    const [deliveryStatus, setDeliveryStatus] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const [orderResponse, productsResponse] = await Promise.all([
                    axios.get(`https://sk8ts-shop.com/api/order/${orderId}`),
                    axios.get('https://sk8ts-shop.com/api/products')
                ]);

                if (orderResponse.data.length > 0) {
                    setOrderItems(orderResponse.data);
                    setDeliveryStatus(orderResponse.data[0].order_status);
                }

                if (Array.isArray(productsResponse.data)) {
                    const names = {};
                    productsResponse.data.forEach((product) => {
                        names[product.product_id] = product.name;
                    });
                    setProductNames(names);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load order data');
                setLoading(false);
            }
        };

        fetchOrderData();
    }, [orderId]);

    const handleDeliveryStatusChange = (event) => {
        event.stopPropagation();
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!orderItems || orderItems.length === 0) return <div>No Order Found</div>;

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
                            onClick={(e) => e.stopPropagation()}
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
                                customizations: (() => {
                                    try {
                                        return item.customization ? JSON.parse(item.customization) : [];
                                    } catch (error) {
                                        console.error('Error parsing customization:', error);
                                        return []; // Fallback to an empty array if parsing fails
                                    }
                                })()
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