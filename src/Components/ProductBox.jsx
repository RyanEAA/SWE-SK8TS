import {Link} from 'react-router-dom'
import '../css/ProductBox.css'
function ProductBox(props) {

  return (
      <div className="polaroid">
      <img src={props.photo} className='profile-photo'/>
      <div className="caption">
        <h3>{props.name}</h3>
        <p>${props.price}</p>
      </div>
    </div>
  )
}

export default ProductBox