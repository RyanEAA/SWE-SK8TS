// LoginPage.jsx

// Step 1: Import axios
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/LoginPage.css';
import '../css/button';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = Cookies.get('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Fetch the user list
      const response = await axios.get('https://sk8ts-shop.com/api/users');
  
      if (response.status === 200 && Array.isArray(response.data)) {
        const users = response.data;
  
        // Check if the entered username and password match any user
        const user = users.find((user) => user.username === username && user.password === password);
  
        if (user) {
          Cookies.set('user', username, { expires: 7 });
          navigate('/'); // Redirect to Home.jsx
          setTimeout(() => {
            window.location.reload(); // Force reload
          }, 100);
          
          // Setting cookies based on if the logged in user is an employee or not
          if (user.user_role == 'admin'){
            Cookies.set('employee', user.user_id, { expires: 7 });
          }

        } else {
          alert('Login failed: Invalid username or password.');
        }
      } else {
        alert('Error retrieving user data.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred. Please try again.');
    }
  };
  
  
  

  const handleRegistration = () => {
    navigate('/registration');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-green" type="submit">Login</button>
      </form>
      <button onClick={handleRegistration}>Register</button>
    </div>
  );
};

export default LoginPage;