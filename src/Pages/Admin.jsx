import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Admin(){
    const navigate = useNavigate();
    
    
    return(
        <div className='admin-page'>

        <div>
            <h1>Admin Section</h1>
            <p>This is the admin page. Only accessible by admins.</p>
            <p> More functionality will be added in the future </p>
        </div>


        </div>
    )
}

export default Admin;