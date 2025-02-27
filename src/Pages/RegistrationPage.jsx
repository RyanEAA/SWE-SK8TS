// RegistrationPage.jsx

import React, { useState, useEffect } from 'react';

const RegistrationPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [existingUsers, setExistingUsers] = useState([]);

  useEffect(() => {
    fetch('https://sk8ts-shop.com/api/users')
      .then((response) => response.json())
      .then((data) => setExistingUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!username) validationErrors.username = 'Username is required';
    if (!email || !validateEmail(email)) validationErrors.email = 'Valid email is required';
    if (!password || !validatePassword(password)) validationErrors.password = 'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a number';
    if (password !== confirmPassword) validationErrors.confirmPassword = 'Passwords do not match';

    // Check if username or email already exists
    if (existingUsers.some(user => user.username === username)) {
      validationErrors.username = 'Username already exists';
    }
    if (existingUsers.some(user => user.email === email)) {
      validationErrors.email = 'Email already exists';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log('Form submitted');
    }
  };

  return (
    <div className="registration-page">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <p>{errors.username}</p>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationPage;
