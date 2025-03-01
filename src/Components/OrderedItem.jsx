import React, {useEffect, useEffect} from 'react';

function OrderedItem({item}){

    const [item, setItem] = useState(null);
    
    return(
        <div className='ordered-item-container'>
            <div className='item-container'>
                <img className='ordered-item-image' src={`/Images/products/${props.item.image_path}`} alt={props.item.name} />
                <div>{item.name}</div>
                <div>${(props.item.price * item.qty).toFixed(2)}</div>
                <div>
                    <button onClick={() => props.onRemove(props.item)}>dec</button> 
                    {props.item.qty} 
                    <button onClick={() => props.onAdd(props.item)}>inc</button>
                </div>
            </div>
        </div>
    );
}

export default OrderedItem;