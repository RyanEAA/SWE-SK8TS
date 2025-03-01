import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/ProductBox.css';
import ProductBox from '../Components/ProductBox';
import '../css/Catelog.css';
import ItemPopup from '../Components/ItemPopup';

import { useSelector } from 'react-redux';


function Catelog({onAdd}) { // function is obtained from App.js
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);

  // Access the cart items from the Redux store
  const cartItems = useSelector((state) => state.cart.items);

  // console.log('cart in popup:', cartItems); // Log the cart items


  /* handles the api call to get the products */
  useEffect(() => {
    // Fetch all products from the API
    fetch('https://sk8ts-shop.com/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        //console.log('Fetched products:', data); // Log the fetched data
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  /* handles user clicking on a product */
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowPopUp(true);
  }
  /* handles user closing the pop up */
  const handleClosePopUp = () => {
    setShowPopUp(false);
    setSelectedProduct(null);
  }

  return (
    <div className='product-gallery'>
      {products.map((product) => (
        <div key={product.product_id} onClick={() => handleProductClick(product)}>
          <ProductBox
            id={product.product_id}
            name={product.name}
            price={product.price}
            photo={`/Images/products/${product.image_path}`}
          /> 
        </div>
      ))}

      {/* pop up for when user clicks on a product */}
      <ItemPopup 
        isOpen={showPopUp} 
        onClose={handleClosePopUp} 
        product={selectedProduct} 
        onAdd={onAdd}
      />
    </div>
  );
}

export default Catelog;
