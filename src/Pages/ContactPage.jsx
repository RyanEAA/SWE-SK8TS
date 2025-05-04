import React from 'react';
import '../css/ContactUs/ContactUs.css';
import Cookies from 'js-cookie';
import axios from 'axios';

const ContactUs = () => {
  // get user data from cookies
  const userId = Cookies.get('user_id');
  const userRole = Cookies.get('user_role');

  // check if user is logged in
  if (!userId || !userRole) {
    alert('No user logged in. Redirecting to login.');
    window.location.href = '/login';
    return;
  }

  // get title and message from form
  const [title, setTitle] = React.useState('');
  const [message, setMessage] = React.useState('');

  // function to handle form submission
  const submitMessage = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://sk8ts-shop.com/api/message', {
        user_id: parseInt(userId),
        title: title.trim(),
        message_text: message.trim()
      });

      if (response.status === 201) {
        alert('Message submitted successfully!');
        setTitle('');
        setMessage('');
      }
    } catch (err) {
      console.error('Error submitting message:', err.response?.data || err.message);
      alert('Failed to submit message. Please try again.');
    }
  };



  return (
    <div className="contact-wrapper">
      <div className="contact-container">
        <div className="contact-info">
          <h2>Contact Us</h2>
          <p>Have a question or need assistance? Get in touch with us!</p>

          <div className="info-block">
            <p><strong>Email</strong><br />info@sk8ts.com</p>
            <p><strong>Phone</strong><br />123-456-7890</p>
            <p><strong>Address</strong><br />123 Skate St.<br />Los Angeles, CA 90001</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={submitMessage}>
          <textarea
            rows="1"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            rows="7"
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
