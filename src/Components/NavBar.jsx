// NavBar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../css/NavBar.css';

  // Ensure props.cartItems is an array, and if it's not, default it to an empty array

const NavBar = (props) => {
  const cartItemCount = props.cartItems ? props.cartItems.reduce((total, item) => total + item.qty, 0) : 0;
  const user = Cookies.get('user');

  return (
    <header>
      <h1>Sk8ts</h1>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/Shop'>Shop</Link>
        <Link to='/Contact'>Contact</Link>
        <Link to='/AboutUs'>About Us</Link>
        <Link to='/Cart'>Cart{' '}{cartItemCount}</Link>
        {user ? (
        <Link to="/profile">Profile</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}

      </nav>
    </header>
  );
        }

export default NavBar;
