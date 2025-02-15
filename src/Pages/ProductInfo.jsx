import { useParams, useLocation } from 'react-router-dom';
import { PRODUCTS } from '../Products.js'
import '../css/ProductInfo.css'


function ProductInfo(props) {
    let { id } = useParams();
    const prod = PRODUCTS.products.find(obj => obj.id == id)
    console.log(prod)
    return (
      <>
      <div>
        {prod.name}
      </div>
      <div>
        ${prod.price}
      </div>
      <img src={prod.image} className='product-image'/>
      <div>
        <button className='add-to-cart-btn' onClick={() => props.onAdd(prod)}>Add To Cart</button>
      </div>
      </>
    )
  }
  
  export default ProductInfo