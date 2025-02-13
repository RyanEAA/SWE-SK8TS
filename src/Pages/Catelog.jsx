// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import '../css/ProductBox.css';
// import ProductBox from '../Components/ProductBox';
// import '../css/Catelog.css';

// function Catelog() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     // Fetch products from the API
//     fetch('http://167.71.25.102:3636/products')
//       .then((response) => response.json())
//       .then((data) => setProducts(data))
//       .catch((error) => console.error('Error fetching products:', error));
//   }, []);
//   console.log('App component rendered');
//   return (
//     <div className='product-gallery'>
//       {products.map((product) => (
//         <ProductBox
//           key={product.id}
//           id={product.id}
//           name={product.name}
//           price={product.price}
//           photo={product.image}
          
//         />
//       ))}
//     </div>
//   );

// }

// export default Catelog;
import React from 'react';

function Catelog() {
  return (
    <div>
      <h1>Catalog Page</h1>
      <p>This is the catalog page.</p>
    </div>
  );
}

export default Catelog;