import '../css/NavBar.css';
import { Link } from 'react-router-dom';

function NavBar(props) {
  // Ensure props.cartItems is an array, and if it's not, default it to an empty array
  const cartItemCount = props.cartItems ? props.cartItems.reduce((total, item) => total + item.qty, 0) : 0;

  return (
    <header>
      <h1>Sk8ts</h1>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/Shop'>Shop</Link>
        <Link to='/Contact'>Contact</Link>
        <Link to='/AboutUs'>About Us</Link>
        <Link to='/Cart'>Cart{' '}{cartItemCount}</Link>
        <Link to='/Login'>Login</Link>
      </nav>
    </header>
  );
}

export default NavBar;
