// AllUsers.jsx
import React from 'react';
import RecentPersonCard from '../RecentPersonCard';
import { useEffect, useState } from 'react';
import CreateUserPopup from './PopUps/CreateUserPopup';
import '../../css/admin/Admin.css';

function AllUsers() {

  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [showCreateUserPopup, setShowCreateUserPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://sk8ts-shop.com/api/allusers/');
      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.log('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="orders-section">
      <h1>All Users</h1>

      {/* button that leads to create user pop coming to screen */}
        <button className="btn btn-green" onClick={() => {
          setSelectedUser(null);               // ✅ clear selected
          setShowCreateUserPopup(true);       // ✅ open modal
        }}>
          Create User
        </button> 

            {/* Popup */}
            {showCreateUserPopup && (
        <CreateUserPopup
          onClose={() => {
            setSelectedUser(null);
            setShowCreateUserPopup(false);
          }}
          onUserCreated={() => {
            fetchAllUsers();
            setSelectedUser(null);
            setShowCreateUserPopup(false);
          }}
          isEditable={!!selectedUser}
          user={selectedUser}
        />
      )}

      {isLoading.users ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="recent-list scrollable-list">
          {allUsers.length > 0 ? (
            allUsers.reverse().map(user => (
              <RecentPersonCard
                key={user.user_id}
                person={user}
                type="user"
                onClick={() => {
                  setSelectedUser(user);
                  setShowCreateUserPopup(true);
                }}
              />            
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
