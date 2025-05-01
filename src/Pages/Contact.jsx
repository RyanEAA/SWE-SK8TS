import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Contact.css';

function Contact() {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        setMessage('');

        // Validate inputs
        let validationErrors = {};
        if (!subject.trim()) validationErrors.subject = 'Subject is required';
        if (!body.trim()) validationErrors.body = 'Message is required';

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('https://sk8ts-shop.com/api/admin/messages', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subject,
                    message: body // Using "message" as the field name for the body content
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || 'Failed to send message');
            } else {
                setMessage('Message sent successfully!');
                // Reset form
                setSubject('');
                setBody('');
                // Optionally redirect after success
                // navigate('/thank-you');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred while sending your message');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='contact-container'>
            <h1>Contact Us</h1>
            {message && <div className={`message ${errors.subject || errors.body ? 'error' : 'success'}`}>
                {message}
            </div>}
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Subject</label>
                    <input
                        type='text'
                        className={`subject-input ${errors.subject ? 'error' : ''}`}
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder='What is this about?'
                    />
                    {errors.subject && <span className="error-message">{errors.subject}</span>}
                </div>
                <div className='form-group'>
                    <label>Message</label>
                    <textarea
                        className={`body-input ${errors.body ? 'error' : ''}`}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder='Type your message here...'
                        rows={8}
                    />
                    {errors.body && <span className="error-message">{errors.body}</span>}
                </div>
                <button type='submit' disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </div>
    );
}

export default Contact;