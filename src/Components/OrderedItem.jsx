function OrderedItem({ item, productName }) {
    return (
        <div className='ordered-item'>
            <div>{productName}</div>
            <div>Quantity: {item.quantity}</div>
            <div>Price: ${item.price}</div>
            {item.customizations && (
                <div>Customization: {item.customizations}</div>
            )}
        </div>
    );
}

export default OrderedItem;