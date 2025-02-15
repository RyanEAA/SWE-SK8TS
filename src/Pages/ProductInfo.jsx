import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../css/ProductInfo.css';

function ProductInfo(props) {
  let { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://167.71.25.102:3636/products/${id}`) // Fetch a single product by ID
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product:', error));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <>
      <div>{product.name}</div>
      <div>${product.price}</div>
      <img src={product.image_url} className='product-image' />
      <div>
        <button className='add-to-cart-btn' onClick={() => props.onAdd(product)}>
          Add To Cart
        </button>
      </div>
    </>
  );
}

export default ProductInfo;
