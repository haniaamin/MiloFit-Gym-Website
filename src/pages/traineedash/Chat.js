import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import '../../styles/Chat.css';
import TraineeSidebar from '../../components/TraineeSidebar';
import TopNav from '../../components/TopNav';
import axios from 'axios';

const socket = io('http://localhost:5000');

const Chat = () => {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const prevConversationRef = useRef(null);
  const messageIdsRef = useRef(new Set());

  // Fetch current user (trainee)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    fetchUser();
  }, []);

  // Fetch trainers list
  useEffect(() => {
    fetch('http://localhost:5000/api/chats/trainers')
      .then(res => res.json())
      .then(data => setTrainers(data))
      .catch(console.error);
  }, []);

  // Create or get conversation with selected trainer
  useEffect(() => {
    if (!selectedTrainer || !currentUser) return;

    fetch('http://localhost:5000/api/chats/conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        traineeId: currentUser._id,
        trainerId: selectedTrainer._id,
      }),
    })
      .then(res => res.json())
      .then(convo => setSelectedConversation(convo._id))
      .catch(console.error);
  }, [selectedTrainer, currentUser]);

  // Message socket logic
  useEffect(() => {
    if (!selectedConversation) return;

    if (prevConversationRef.current) {
      socket.emit('leave_conversation', prevConversationRef.current);
    }
    prevConversationRef.current = selectedConversation;

    messageIdsRef.current.clear();
    setMessages([]);  // Clear all messages before fetching fresh ones

    fetch(`http://localhost:5000/api/chats/messages/${selectedConversation}`)
      .then(res => res.json())
      .then(data => {
        data.forEach(msg => messageIdsRef.current.add(msg._id));
        setMessages(data);
      });

    socket.emit('join_conversation', selectedConversation);
    
    const handleReceiveMessage = (msg) => {
      if (!messageIdsRef.current.has(msg._id)) {
        setMessages(prev => [...prev, msg]);
        messageIdsRef.current.add(msg._id);
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.emit('leave_conversation', selectedConversation);
    };
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    const tempId = Date.now().toString();

    const localMsg = {
      _id: tempId,
      conversationId: selectedConversation,
      sender: currentUser,
      text: newMessage.trim(),
      time: new Date().toISOString(),
    };

    setMessages(prev => [...prev, localMsg]);
    messageIdsRef.current.add(tempId); // Add temporary ID

    setNewMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/chats/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConversation,
          sender: currentUser,
          text: localMsg.text,
        }),
      });

      const savedMsg = await response.json();
      if (savedMsg && savedMsg._id) {
        // Remove the temp message and replace with the actual one
        setMessages(prev =>
          prev
            .filter(msg => msg._id !== tempId)
            .concat(savedMsg)
        );
        messageIdsRef.current.add(savedMsg._id);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="trainee-dash">
      <div className="background-overlay"></div>
      <TraineeSidebar />
      <div className="main-content">
        <TopNav />
        <div className="traineechat-container">
          <div className="trainer-list">
            <h3>Trainers</h3>
            <ul>
              {trainers.map((trainer) => (
                <li
                  key={trainer._id}
                  className={
                    selectedTrainer && trainer._id === selectedTrainer._id ? 'selected' : ''
                  }
                  onClick={() => setSelectedTrainer(trainer)}
                >
                  <div className="trainer-avatar">
                    {trainer.firstName.charAt(0)}{trainer.lastName.charAt(0)}
                  </div>
                  <div className="trainer-info">
                    <span className="trainer-name">{trainer.firstName} {trainer.lastName}</span>
                    <span className="trainer-status">Online</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="chat-window">
            {selectedConversation ? (
              <>
                <div className="chat-header">
                  <div className="chat-partner-info">
                    <div className="chat-avatar">
                      {selectedTrainer.firstName.charAt(0)}{selectedTrainer.lastName.charAt(0)}
                    </div>
                    <div>
                      <h4>{selectedTrainer.firstName} {selectedTrainer.lastName}</h4>
                      <span className="status-indicator">Online</span>
                    </div>
                  </div>
                </div>
                
                <div className="messages" id="messages-scrollable">
                  {messages.map(msg => (
                    <div
                      key={msg._id}
                      className={`message-container ${
                        msg.sender._id === currentUser._id ? 'sent' : 'received'
                      }`}
                    >
                      <div className="message-content">
                        {msg.sender._id !== currentUser._id && (
                          <div className="message-sender">{msg.sender.firstName}</div>
                        )}
                        <div className="message-bubble">
                          <div className="message-text">{msg.text}</div>
                          <div className="message-time">
                            {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="chat-input">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button onClick={handleSend}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <div className="no-chat">
                <div className="no-chat-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#570303" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h3>Select a trainer to start chatting</h3>
                <p>Choose from your available trainers to begin your conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;