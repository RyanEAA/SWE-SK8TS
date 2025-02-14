import { useParams, useLocation } from 'react-router-dom';
import { PRODUCTS } from '../Products.js'
import '../css/ProductInfo.css'


function ProductInfo(props) {
    let { id } = useParams();
    const prod = PRODUCTS.products.find(obj => obj.id == id)
    console.log(prod)
    return (
      <>
      <div className='product-info-container'>
        <img src={prod.image} className='product-image'/>
        <div className='product-text-container'>
          <div className='product-name'>
            {prod.name}
          </div>
          <div className='product-description'>
            {prod.description}
          </div>
          <div className='product-price'>
            ${prod.price}
          </div>
          <button className='add-to-cart-btn' onClick={() => props.onAdd(prod)}>Add To Cart</button>
        </div>
      </div>
      </>
    )
  }
  
  export default ProductInfo