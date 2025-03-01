import React, {useEffect, useState} from 'react';
import OrderedItem from './OrderedItem';

function OrderedItems({userData}){
    // if there's no user
    if (!userData) {
        return <div>No Orders</div>;
    }

    const userId = userData.user_id;

    const [orderedItems, setOrderedItems] = useState([]);

    useEffect(() => {
        fetch(`https://sk8ts-shop.com/api/orders/${userId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            console.log('Fetched ordered items:', data); // Log the fetched data
            setOrderedItems(data);
        })
        .catch((error) => {
            console.error('Error fetching ordered items:', error);
        });
    }, []);
    
    return(
        <div className='ordered-items-container'>
            <h1>Ordered Items</h1>
            <h1>num of items = {Array.isArray(orderedItems) ? orderedItems.length : 0} </h1>
        </div>
    );
}

export default OrderedItems;