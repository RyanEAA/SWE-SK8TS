import {Link} from 'react-router-dom'
import '../css/ProductBox.css'
function ProductBox(props) {

  return (
    <Link className='product-info-link' to={`/ProductInfo/${props.id}`}>
      <div className="polaroid">
      <img src={props.photo} className='profile-photo'/>
      <div className="caption">
        <p className='prop-name'>{props.name}</p>
        <p className='prop-price'>${props.price}</p>
      </div>
    </div>
    </Link>
  )
}

export default ProductBox