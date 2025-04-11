import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/admin/Admin.css'; // Import the CSS file

function Admin() {
    return (
        <div className='admin-page'>
            <div className='admin-section top-left'>
                <h1>Admin Abilities</h1>
                <p>This is the admin page. Only accessible by admins.</p>
            </div>
            
            <div className='admin-section top-right'>
                <h1>User Management</h1>
                <p>Manage user accounts and permissions</p>
            </div>
            
            <div className='admin-section bottom-left'>
                <h1>Recently Active Employees</h1>
                <p>View recent employee activity</p>
            </div>
            
            <div className='admin-section bottom-right'>
                <h1>Recent Orders</h1>
                <p>Here's where recent orders will show up</p>
            </div>
        </div>
    );
}

export default Admin;