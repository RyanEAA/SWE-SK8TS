// CreateUserPopup.jsx
import React, { useState } from 'react';
import '../../../css/admin/CreateUserPopup.css';


function CreateUserPopup({ onClose, onUserCreated }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userRole, setUserRole] = useState('customer'); // allow admin to pick role if you want
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
  const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W]).{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage('');
    const validationErrors = {};

    if (!username) validationErrors.username = 'Username is required';
    if (!email || !validateEmail(email)) validationErrors.email = 'Valid email is required';
    if (!password || !validatePassword(password)) {
      validationErrors.password = 'Password must be at least 8 characters long, contain an uppercase letter, lowercase letter, number, and special character';
    }
    if (password !== confirmPassword) validationErrors.confirmPassword = 'Passwords do not match';
    if (!firstName) validationErrors.firstName = 'First name is required';
    if (!lastName) validationErrors.lastName = 'Last name is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('https://sk8ts-shop.com/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          user_role: userRole
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Failed to create user.');
      } else {
        setMessage('User created successfully!');
        onUserCreated(); // let parent refresh user list maybe
        onClose(); // close popup
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setMessage('Error creating user.');
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Create New User</h2>
        {message && <p className="popup-message">{message}</p>}
        <form onSubmit={handleSubmit} className="popup-form">
          <div className="form-group">
            <label>First Name:</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            {errors.firstName && <small>{errors.firstName}</small>}
          </div>

          <div className="form-group">
            <label>Last Name:</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            {errors.lastName && <small>{errors.lastName}</small>}
          </div>

          <div className="form-group">
            <label>Username:</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            {errors.username && <small>{errors.username}</small>}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <small>{errors.email}</small>}
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {errors.password && <small>{errors.password}</small>}
          </div>

          <div className="form-group">
            <label>Confirm Password:</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            {errors.confirmPassword && <small>{errors.confirmPassword}</small>}
          </div>

          <div className="form-group">
            <label>User Role:</label>
            <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
              <option value="customer">Customer</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="popup-buttons">
            <button type="submit" className="btn btn-green">Create</button>
            <button type="button" className="btn btn-red" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserPopup;
