import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
  // for navigating to other pages
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,}$/;
    return re.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    let validationErrors = {};

    if (!username) validationErrors.username = 'Username is required';
    if (!email || !validateEmail(email)) validationErrors.email = 'Valid email is required';
    if (!password || !validatePassword(password)) {
      validationErrors.password = 'Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character';
    }
    if (password !== confirmPassword) validationErrors.confirmPassword = 'Passwords do not match';
    if (!firstName) validationErrors.firstName = 'First name is required';
    if (!lastName) validationErrors.lastName = 'Last name is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('https://sk8ts-shop.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password, // Send the plain text password
          first_name: firstName,
          last_name: lastName,
          user_role: 'customer'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.errors) {
          const apiErrors = {};
          data.errors.forEach((err) => {
            apiErrors[err.param] = err.msg;
          });
          setErrors(apiErrors);
        } else {
          setMessage(data.error || 'Registration failed');
        }
      } else {
        // user succesfully registered
        setMessage('User registered successfully!');
        // nagigate to profile page
        navigate('/profile'); // Replace '/profile' with your desired route
      }
    } catch (error) {
      setMessage('Error registering user');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="registration-page">
      <h2>Register</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          {errors.firstName && <p>{errors.firstName}</p>}
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          {errors.lastName && <p>{errors.lastName}</p>}
        </div>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          {errors.username && <p>{errors.username}</p>}
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationPage;
