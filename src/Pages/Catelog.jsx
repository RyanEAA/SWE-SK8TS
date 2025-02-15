// import {Link} from 'react-router-dom'
// import '../css/ProductBox.css'
// import ProductBox from '../Components/ProductBox'
// import '../css/Catelog.css'
// import { PRODUCTS } from '../Products'
// function Catelog() {

//   return (
//     <div className='product-gallery'>
//       {PRODUCTS.products.map((product) => (
//         <ProductBox id={product.id} name={product.name} price={product.price} photo={product.image}/>
//       ))}
//       {/* <ProductBox id={PRODUCTS[1].id} name={PRODUCTS[1].name} price={PRODUCTS[1].price} photo={PRODUCTS[1].image}/>
//       <ProductBox id={PRODUCTS[2].id} name={PRODUCTS[2].name} price={PRODUCTS[2].price} photo={PRODUCTS[2].image}/>
//       <ProductBox id={PRODUCTS[3].id} name={PRODUCTS[3].name} price={PRODUCTS[3].price} photo={PRODUCTS[3].image}/>
//       <ProductBox id={PRODUCTS[4].id} name={PRODUCTS[4].name} price={PRODUCTS[4].price} photo={PRODUCTS[4].image}/> */}
//     </div>
//   )
// }

// export default Catelog

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