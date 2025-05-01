import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Contact.css';

function Contact() {
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');

    return (
        <div className='contact-container'>
            <h1>Contact Us</h1>
            <form>
                <div className='form-group'>
                    <label>Subject</label>
                    <input
                        type='text'
                        className='subject-input'
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder='What is this about?'
                    />
                </div>
                <div className='form-group'>
                    <label>Message</label>
                    <textarea
                        className='body-input'
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder='Type your message here...'
                    />
                </div>
                <button type='submit'>Send Message</button>
            </form>
        </div>
    );
}

export default Contact;