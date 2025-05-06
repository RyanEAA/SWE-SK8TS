import React from 'react';
import '../css/Contact.css';
import Cookies from 'js-cookie';
import axios from 'axios';

const Contact = () => {
  // get user data from cookies
  const userId = Cookies.get('user_id');
  const userRole = Cookies.get('user_role');

  // check if user is logged in
  if (!userId || !userRole) {
    alert('No user logged in. Redirecting to login.');
    window.location.href = '/login';
    return;
  }

  // form state
  const [title, setTitle] = React.useState('');
  const [messageText, setMessageText] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [statusMessage, setStatusMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // function to handle form submission
  const submitMessage = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    setStatusMessage('');

    // Validate inputs
    let validationErrors = {};
    if (!title.trim()) validationErrors.title = 'Title is required';
    if (!messageText.trim()) validationErrors.messageText = 'Message is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('https://sk8ts-shop.com/api/message', {
        user_id: parseInt(userId),
        title: title.trim(),
        message_text: messageText.trim()
      });

      if (response.status === 201) {
        setStatusMessage('Message submitted successfully!');
        setTitle('');
        setMessageText('');
      }
    } catch (err) {
      console.error('Error submitting message:', err.response?.data || err.message);
      setStatusMessage('Failed to submit message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-container">
      <div className="contact-info-container">
        <h1>Contact Us</h1>
        <p className="contact-description">Have a question or need assistance? Get in touch with us!</p>
        
        <div className="info-block">
          <h3>Contact Information</h3>
          <div className="info-item">
            <strong>Email</strong>
            <p>info@sk8ts.com</p>
          </div>
          <div className="info-item">
            <strong>Phone</strong>
            <p>123-456-7890</p>
          </div>
          <div className="info-item">
            <strong>Address</strong>
            <p>3001 S Congress Ave<br />Austin, TX 78704</p>
          </div>
        </div>
      </div>

      <div className="contact-form-container">
        {statusMessage && (
          <div className={`message ${errors.title || errors.messageText ? 'error' : 'success'}`}>
            {statusMessage}
          </div>
        )}
        
        <form onSubmit={submitMessage} className="contact-form">
          <h2>Send us a message</h2>
          
          <div className='form-group'>
            <label>Title</label>
            <input
              type='text'
              className={`form-control ${errors.title ? 'error' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='What is this about?'
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>
          
          <div className='form-group'>
            <label>Message</label>
            <textarea
              className={`form-control ${errors.messageText ? 'error' : ''}`}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder='Type your message here...'
              rows={8}
            />
            {errors.messageText && <span className="error-message">{errors.messageText}</span>}
          </div>
          
          <button 
            type='submit' 
            className="btn btn-green" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;