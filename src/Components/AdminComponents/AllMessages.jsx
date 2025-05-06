// AdminMessages.jsx
import React, { useEffect, useState } from 'react';
import '../../css/admin/AdminMessages.css';
import MessagePopup from './PopUps/MessagePopup';

function AllMessages() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('https://sk8ts-shop.com/api/admin/messages');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="orders-section">
      <h1>Customer Messages</h1>
      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <div className="recent-list scrollable-list">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.message_id}
                className="message-summary"
                onClick={() => {
                  setSelectedMessageId(msg.message_id);
                  setShowPopup(true);
                }}
              >
                <h3>{msg.title}</h3>
                <p>From: {msg.username}</p>
                <p>Date: {new Date(msg.created_at).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No messages found</p>
          )}
        </div>
      )}

      {showPopup && (
        <MessagePopup
          messageId={selectedMessageId}
          onClose={() => {
            setSelectedMessageId(null);
            setShowPopup(false);
            fetchMessages();
          }}
        />
      )}
    </div>
  );
}

export default AllMessages;
