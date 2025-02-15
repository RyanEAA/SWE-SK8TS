import CartItem from "../Components/CartItem.jsx";
import '../css/Cart.css';
import React, { useState, useEffect } from 'react';

function Cart(props) {
  const [products, setProducts] = useState([]); // State for holding all products from the API

  useEffect(() => {
    // Fetch all products when the Cart component mounts
    fetch('http://167.71.25.102:3636/products') // Fetch from the API
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data); // Save fetched data into products state
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  // Calculate prices and taxes
  const itemsPrice = props.cartItems.reduce((a, c) => {
    const product = products.find(p => p.product_id === c.id); // Find the product in the fetched products
    return a + (product ? product.price * c.qty : 0); // Only use the product price if it's found
  }, 0);
  
  const taxPrice = itemsPrice * 0.08;
  const totalPrice = itemsPrice + taxPrice; // Include tax in the total price

  const handleCheckout = () => {
    // Handle checkout, possibly sending the cart data to the backend
    alert('Proceeding to checkout');
  };

  return (
    <>
      <div className="cart-labels-container">
        <div></div>
        <div>Name</div>
        <div>Price</div>
        <div>Quantity</div>
      </div>
      <div id="cart-item-container">
        {props.cartItems.length === 0 && <div>Cart Is Empty</div>}
        {props.cartItems.map((item) => {
          const product = products.find(p => p.product_id === item.id); // Get product details for cart item
          return (
            <CartItem
              key={item.id}
              item={item}
              product={product}
              onAdd={props.onAdd}
              onRemove={props.onRemove}
            />
          );
        })}
      </div>
      <div>
        {props.cartItems.length !== 0 && (
          <>
            <hr />
            <div>Total Price: </div>
            <div>${itemsPrice.toFixed(2)}</div>
            <div>Tax (8%): ${taxPrice.toFixed(2)}</div>
            <div>Total with Tax: ${totalPrice.toFixed(2)}</div>
          </>
        )}
        <hr />
        <button onClick={handleCheckout}>Check Out</button>
      </div>
    </>
  );
}

export default Cart;
