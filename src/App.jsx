import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import NavBar from './Components/NavBar.jsx';
import Catelog from './Pages/Catelog.jsx';
import AboutUs from './Pages/AboutUs.jsx';
import Footer from './Components/Footer.jsx';
import Home from './Pages/Home.jsx';
import ProductInfo from './Pages/ProductInfo.jsx';
import Cart from './Pages/Cart.jsx';
import RegistrationPage from './Pages/RegistrationPage.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://sk8ts-shop.com/api/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);
<<<<<<< HEAD
  
  const onAdd = (product) => {
=======

  useEffect(() => {
    console.log("Current cart state:", cartItems);
  }, [cartItems]);

  const onAdd = (product, qty = 1) => {
>>>>>>> popup
    const exist = cartItems.find((x) => x.product_id === product.product_id);
    if (exist) {
      setCartItems(cartItems.map((x) =>
        x.product_id === product.product_id ? { ...exist, qty: exist.qty + qty } : x
      ));
    } else {
      setCartItems([...cartItems, { ...product, qty }]);
    }
  };

  const onRemove = (product) => {
    const exist = cartItems.find((x) => x.product_id === product.product_id);
    if (!exist) return; // Prevent errors if item isn’t found
    if (exist.qty === 1) {
      setCartItems(cartItems.filter((x) => x.product_id !== product.product_id));
    } else {
      setCartItems(cartItems.map((x) =>
        x.product_id === product.product_id ? { ...exist, qty: exist.qty - 1 } : x
      ));
    }
  };

  return (
    <>
      <NavBar cartItems={cartItems} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Shop' element={<Catelog onAdd={onAdd} />} />
        <Route path='/AboutUs' element={<AboutUs />} />
        <Route path='/Cart' element={<Cart cartItems={cartItems} onAdd={onAdd} onRemove={onRemove} />} />
        <Route path='/ProductInfo/:id' element={<ProductInfo onAdd={onAdd} />} />
        <Route path='/Registration' element={<RegistrationPage />} />
        <Route path='/ProfilePage' element={<ProfilePage />} />
        {/* Add your AboutMe routes here */}
        <Route path='*' element={<div>404 - Page Not Found</div>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;