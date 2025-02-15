import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/ProductBox.css';
import ProductBox from '../Components/ProductBox';
import '../css/Catelog.css';

function Catelog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the API
    fetch('http://167.71.25.102:3636/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched products:', data); // Log the fetched data
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div className='product-gallery'>
      {products.map((product) => (
        <ProductBox
          key={product.product_id} // Use product_id as the key
          id={product.product_id} // Pass product_id as the id
          name={product.name}
          price={product.price}
          photo={product.image_url} // Use image_url from the API
        />
      ))}
    </div>
  );
}

export default Catelog;