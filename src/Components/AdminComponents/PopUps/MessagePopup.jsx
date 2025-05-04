import React, { useEffect, useState } from 'react';
import '../../../css/admin/MessagePopup.css'; // reuse existing styling

const MessagePopup = ({ messageId, onClose }) => {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await fetch(`https://sk8ts-shop.com/api/admin/message/${messageId}`);
        const data = await res.json();
        setMessage(data);
      } catch (err) {
        console.error('Error fetching message:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, [messageId]);

  const markAsRead = async () => {
    try {
      const res = await fetch(`https://sk8ts-shop.com/api/admin/message/${messageId}/markread`, {
        method: 'PUT',
      });
      if (res.ok) {
        setUpdateSuccess(true);
        setTimeout(onClose, 1500); // auto-close
      }
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };

  if (isLoading) return <div className="popup-overlay">Loading...</div>;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>{message.title}</h2>
        <p><strong>From:</strong> {message.username} ({message.email})</p>
        <p><strong>Received:</strong> {new Date(message.created_at).toLocaleString()}</p>
        <p><strong>Message:</strong></p>
        <p>{message.message_text}</p>
        <p><strong>Status:</strong> {message.is_read ? 'Read' : 'Unread'}</p>

        <div className="popup-buttons">
          {!message.is_read && (
            <button className="btn btn-green" onClick={markAsRead}>
              Mark as Read
            </button>
          )}
          <button className="btn btn-red" onClick={onClose}>Close</button>
        </div>

        {updateSuccess && <p className="popup-message">Marked as read!</p>}
      </div>
    </div>
  );
};

export default MessagePopup;
