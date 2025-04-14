// AllUsers.jsx
import React from 'react';
import RecentPersonCard from '../RecentPersonCard';
import { useEffect, useState } from 'react';
import CreateUserPopup from './PopUps/CreateUserPopUp';
import '../../css/admin/Admin.css';

function AllUsers() {

  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [showCreateUserPopup, setShowCreateUserPopup] = useState(false);

  useEffect(() => {
    const fetchAllUsers = async () => {

      try {
        setIsLoading(true);
        const response = await fetch('https://sk8ts-shop.com/api/allusers/');
        //const response = await fetch('http://localhost:3636/allusers');
        const data = await response.json();
        setAllUsers(data);
      }catch (error){
        console.log('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUsers();
  }, [])

  return (
    <div className="orders-section">
      <h1>All Users</h1>

      {/* button that leads to create user pop coming to screen */}
      <button className="btn btn-green" onClick={() => setShowCreateUserPopup(true)}>
        Create User
      </button>    

            {/* Popup */}
      {showCreateUserPopup && (
        <CreateUserPopup
          onClose={() => setShowCreateUserPopup(false)}
          onUserCreated={() => {
            fetchAllUsers();   // refresh the user list after new user is added
            setShowCreateUserPopup(false); // close popup
          }}
        />
      )}

      {isLoading.users ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="recent-list scrollable-list">
          {allUsers.length > 0 ? (
            allUsers.map(user => (
              <RecentPersonCard key={user.user_id} person={user} type="user" />
            ))
          ) : (
            <p>No users found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default AllUsers;
