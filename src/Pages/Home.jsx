// Home.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/Home.css';

const LoopingVideo = () => {
  return (
    <video autoPlay loop muted playsInline>
      <source src="/Video/SkateVideo.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check session status from local storage or API
    const session = localStorage.getItem('session');
    if (session) {
      setIsLoggedIn(true);
    }
  }, []);

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
          <Link to="/ProductInfo/6">
            <img src="/Images/products/mini-cruiser-board.jpeg" className="image-highlight" alt="Cruiser" />
          </Link>
          <p className='desc-container'>Check out our latest cruiser complete!</p>
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
        <div className="extra-image-container">
          <Link to="/Shop">
            <img src="/Images/newGearComingSoon.jpg" className="extra-image" alt="New Skate Gear" />
          </Link>
          <p className='desc-container'>New Gear Coming Soon!</p>
        </div>
      </div>

      <footer>
        Check out the team! <Link to="/AboutUs">About Us</Link>
        <p>
          Haven't joined the family? {isLoggedIn ? <Link to="/profile">Profile</Link> : <Link to="/LoginPage">Login!</Link>}
        </p>
      </footer>
    </div>
  );
}

export default Home;
