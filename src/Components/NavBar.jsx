// NavBar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import '../css/NavBar.css';

// get redux store
import { useSelector } from 'react-redux';

const NavBar = (props) => {
  const cart = useSelector((state) => state.cart);

  const cartItemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  const user = Cookies.get('user');
  const userRole = Cookies.get('user_role');

  return (
    <header>
      <h1>Sk8ts</h1>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/Shop'>Shop</Link>
        <Link to='/AboutUs'>About Us</Link>
        {(userRole === 'customer') && (
          <Link to="/Contact">Contact</Link>
        )}
        <Link to='/Cart'>Cart{' '}{cartItemCount}</Link>
        {user ? (
        <Link to="/profile">Profile</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
        {(userRole === 'employee' || userRole === 'admin') && (
          <Link to="/OrderDashboard">Order Dashboard</Link>
        )}

      </nav>
    </header>
  );
        }

export default NavBar;
