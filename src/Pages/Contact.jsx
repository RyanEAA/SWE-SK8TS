import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//Title and body and send button

function Contact(){
    return(
        <div className='big-container'>
            Big div
            <div>Subject
                <input type='text'></input>
            </div>
            <div>
                Body
                <input type="text" />
            </div>
        </div>
    );

    
}

export default Contact;