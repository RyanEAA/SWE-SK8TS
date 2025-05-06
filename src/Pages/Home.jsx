// Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';
import axios from 'axios';
import Cookies from 'js-cookie';

const LoopingVideo = () => {
  return (
    <video autoPlay loop muted playsInline>
      <source src="/Video/SkateVideo.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

function Home() {
  const [randomProduct, setRandomProduct, isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check session status from local storage or API
    const session = localStorage.getItem('session');
    if (session) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchRandomProduct = async () => {
      try {
        const response = await axios.get('https://sk8ts-shop.com/api/products');
        if (response.status === 200 && Array.isArray(response.data)) {
          const products = response.data;
          const randomIndex = Math.floor(Math.random() * products.length);
          setRandomProduct(products[randomIndex]);
        } else {
          console.error('Error fetching products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchRandomProduct();
  }, []);

  if (!randomProduct) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-container">
      <div>
        <img src="/Images/WelcomeSkaters.jpg" className="header-image-container" alt="Welcome Skaters" />
      </div>
      
      <h1 className="welcome-container">Welcome to SK8TS!</h1>
      
      <p className="about-business-container">
        SK8TS is an online skate store 
        founded by five passionate programmers from Austin, Texas.
         Built on a love for the local skate scene, they offer 
         a curated selection of decks, trucks, wheels, and apparel 
         from top brands, along with exclusive in-house designs. 
         With a commitment to quality, style, and community, 
         SK8TS is more than a shop, rather a movement for skaters, by skaters.
      </p>

      {/* FLEXBOX CONTAINER FOR VIDEO, IMAGE & EXTRA IMAGE */}
      <div className="media-container">
        {/* IMAGE */}
        <div className="image-highlight-container">

          <h2>Featured Product</h2>
        <Link to={`/productInfo/${randomProduct.product_id}`}>
          <img src={randomProduct.image_path} alt={randomProduct.name} className="image-highlight"/>
          <p>{randomProduct.name}</p>
        </Link>
        </div>

        {/* VIDEO */}
        <div className="video-highlight-container">
          <Link to="/Shop">
            <LoopingVideo />
          </Link>
          <p className='desc-container'>
            Click on the video to visit our shop! Don't forget to check out one of our sponsored riders: 
            <Link to="/AboutUs/william"> Will Burgess</Link>
          </p>
        </div>

        {/* EXTRA IMAGE FOR SYMMETRY */}
        <div className="image-highlight-container">
        <h2 className='desc-container'>New Gear Coming Soon!</h2>
          <Link to="/Shop">
            <img src="/Images/newGearComingSoon.jpg" className="extra-image" alt="New Skate Gear" />
          </Link>
          
        </div>
      </div>

      {/* <footer>
        Check out the team! <Link to="/AboutUs">About Us</Link>
        <p>
          Haven't joined the family? {isLoggedIn ? <Link to="/profile">Profile</Link> : <Link to="/LoginPage">Login!</Link>}
        </p>
      </footer> */}
    </div>
  );
}

export default Home;
