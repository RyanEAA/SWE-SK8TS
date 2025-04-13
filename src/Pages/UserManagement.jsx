import '../css/UserManagement.css';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const userRole = Cookies.get('user_role');
                
                if (!userRole || (userRole !== 'admin')) {
                    navigate('/profile');
                    return;
                }

                setIsLoading(true);

                const response = await axios.get(`https://sk8ts-shop.com/api/users`);
                
                if (response.status === 200 && Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    console.error('Unexpected response format:', response);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                alert('Failed to load users. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        }
        fetchAllUsers();
    }, [navigate]);

    const handleDeleteUser = async (userId) => {
        try {
            const response = await axios.delete(`https://sk8ts-shop.com/api/users/${userId}`);
            if (response.status === 200) {
                setUsers(users.filter(user => user.id !== userId));
                alert('User deleted successfully');
                window.location.reload()
            } else {
                alert('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user. Please try again later.');
        }
    }

    const handleAddUser = async (e) => {
        e.preventDefault();

        try {
            console.log({
                username,
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                user_role: role
            });
            const response = await axios.post(
                `https://sk8ts-shop.com/api/users`,
                {
                    username,
                    email,
                    password,
                    first_name: firstName,
                    last_name: lastName,
                    user_role: role
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.status === 200 || response.status === 201) {
                alert('User added successfully');
                window.location.reload()
            } else {
                alert('Failed to add user');
            }
        } catch (error) {
            if (error.response) {
                console.error('Server responded with an error:', error.response.data);
            } else {
                console.error('Error adding user:', error.message);
            }
            alert('Failed to add user. Please try again later.');
        }    
    }

    return (
       <>
            <div className='admin-section top-left claimed-orders-container'>
                <h1>User Management</h1>
                <h2>Create New User</h2>
                <div className='add-user-headers'>
                    <div className='unclaimed-order-id'>Username </div>
                    <div className='unclaimed-order-user-id'>First Name</div>
                    <div className='unclaimed-order-price'>Last Name</div>
                    <div className='unclaimed-order-price'>Email</div>
                    <div className='unclaimed-order-price'>Role</div>
                    <div className='unclaimed-order-price'>Password</div>
                </div>
                <form onSubmit={handleAddUser}>
                    <div className='add-user-container'>
                        <input type="text" onChange={(e) => setUsername(e.target.value)}/>
                        <input type="text" onChange={(e) => setFirstName(e.target.value)}/>
                        <input type="text" onChange={(e) => setLastName(e.target.value)}/>
                        <input type="text" onChange={(e) => setEmail(e.target.value)}/>
                        <input type="text" onChange={(e) => setRole(e.target.value)}/>
                        <input type="text" onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <button type='submit'>Add User</button>
                </form>
                <h2>Users</h2>
                <div className='users-headers'>
                    <div className='unclaimed-order-id'>Username </div>
                    <div className='unclaimed-order-user-id'>Name</div>
                    <div className='unclaimed-order-price'>Email</div>
                    <div className='unclaimed-order-price'>Role</div>
                    <div></div>
                </div>
                <div>
                    {users.reverse().map((user) => (
                        <div key={user.id} className='users-container'>
                            <div>{user.username}</div>
                            <div>{user.first_name} {user.last_name}</div>
                            <div>{user.email}</div>
                            <div>{user.user_role}</div>
                            <button className='btn btn-primary' onClick={() => handleDeleteUser(user.user_id)}>Delete</button>
                        </div>
                    ))}
                </div>
                
            </div>
       </>
    );
}

export default UserManagement;