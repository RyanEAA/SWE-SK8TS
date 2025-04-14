import React from 'react';
import '../css/admin/Admin.css';

function RecentPersonCard({ person, type = 'user' }) {
    const displayDate = type === 'user' 
        ? new Date(person.created_at).toLocaleDateString()
        : person.last_login === '0000-00-00 00:00:00' 
            ? 'Never logged in' 
            : new Date(person.last_login).toLocaleDateString();

    const title = type === 'user' 
        ? 'Registered' 
        : 'Last Active';

    return (
        <div className="recent-card">
            <div className="profile-pic-container">
                <img 
                    src={"https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg?semt=ais_hybrid"} 
                    alt="Profile" 
                    className="profile-pic"
                />
            </div>
            <div className="user-details">
                <h4>{person.first_name} {person.last_name}</h4>
                <p className="username">@{person.username}</p>
                <p>{title}: {displayDate}</p>
            </div>
        </div>
    );
}

export default RecentPersonCard;