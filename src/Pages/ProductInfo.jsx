import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ProductInfo.css'; // Make sure the CSS file is imported

function ProductInfo({ onAdd }) {
  const { id } = useParams(); // Get the product id from the URL
  const [products, setProducts] = useState([]); // State to hold all products
  const [product, setProduct] = useState(null); // State to hold the specific product
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle any errors

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch all the products
    fetch('https://sk8ts-shop.com/api/products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data); // Set all products in state
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        setError(error.message); // Set the error message if fetching fails
        setLoading(false); // Stop loading in case of error
      });
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  useEffect(() => {
    const selectedProduct = products.find((prod) => prod.product_id === parseInt(id));
    setProduct(selectedProduct); // Set the specific product
  }, [id, products]); // Re-run this effect if id or products change

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found!</div>;
  }

  return (
    <div className="product-info-container">
      <h1>{product.name}</h1>
      <div className="product-info">
        <div className="product-image-container">
          <img className="product-image" src={product.image_path} alt={product.name} />
        </div>
        <div className="product-details">
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Dimensions:</strong> {product.dimensions}</p>
          <p><strong>Weight:</strong> {product.weight} lbs</p>
          <button className='add-to-cart-btn' onClick={() => onAdd(product)}>Add To Cart</button>
        </div>
      </div>
      
    </div>
  );
}

export default ProductInfo;
