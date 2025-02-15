import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/ProductBox.css';
import ProductBox from '../Components/ProductBox';
import '../css/Catelog.css';

function Catelog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch all products from the API
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
        <Link
        key={product.product_id}
        to={{
          pathname: `/ProductInfo/${product.product_id}`,
          state: { products } // Passing the entire products array to the product info page
        }}
      >
        <ProductBox
          id={product.product_id}
          name={product.name}
          price={product.price}
          photo={product.image_url}
        />
      </Link>      
      ))}
    </div>
  );
}

export default Catelog;
