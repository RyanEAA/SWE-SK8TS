import React, { useState, useEffect } from 'react'; // used for managing state and side effects
import { useParams } from 'react-router-dom'; // allows us to use urls
import '../css/ProfilePage.css'; // css file for styling

function ProfilePage() {
    return (
        <div className='profile-container'>
            {/* Profile page content goes here */}
            <div className='profile-header'>

                <img src="../assets/profile.jpg" alt="Profile" className='profile-image' />

                <div className='profile-header-text'>
                    <h1 className='profile-name'>John Doe</h1>
                    <h1 className='profile-role'>User</h1>
                </div>
            </div>
            <div className='profile-details'>
                <table> 
                    <tr>
                        <td className='profile-details'>Username</td>
                        <td>JohnDoe</td>
                    </tr>
                    <tr>
                        <td className='profile-details'>First Name</td>
                        <td>John</td>
                    </tr>
                    <tr>
                        <td className='profile-details'>Last Name</td>
                        <td>Doe</td>
                    </tr>
                    <tr>
                        <td className='profile-details'>Email</td>
                        <td>test@gmail.com</td>
                    </tr>
                    <tr>
                        <td className='profile-details'>Shipping_Address</td>
                        <td>3001 South Congress 
                        Austin, Texas</td>
                    </tr>
                </table>
            </div>

        </div>
    );
}
export default ProfilePage;