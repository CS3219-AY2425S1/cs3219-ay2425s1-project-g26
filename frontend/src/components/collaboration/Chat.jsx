import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chat = ({ sessionId, userId , currSocket }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('');
  const socket = currSocket;
  const chatWindowRef = useRef(null);

  // Fetch messages from the server
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8085/chats/${sessionId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [sessionId]);

  // Fetch the username based on userId
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/users/public`);
        const user = response.data.data.find((user) => user.id === userId);
        if (user) {
          setUsername(user.username);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, [userId]);

  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off('receiveMessage');
      }
    };
  }, [socket]);

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue) return;

    const newMessage = { userId, username, message: inputValue };

    try {
      await axios.post(`http://localhost:8085/chats/${sessionId}`, newMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { userId: newMessage.userId, username: newMessage.username, message: inputValue, timeSent: new Date() },
      ]);
      setInputValue('');
      if (socket) {
        socket.emit('sendMessage', { sessionId, ...newMessage });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    const chatWindow = chatWindowRef.current;
    if (chatWindow) {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }, [messages]);

  return (
    <div className='chat-container'>
      <h3>Chat</h3>
      <div className='chat-window' ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.userId === userId ? 'user' : 'partner'}`}>
            <strong>{msg.userId === userId ? 'You' : msg.username}: </strong> 
            {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className='message-form' >
        <input
          className='message-input'
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder='Type your message here...'
        />
        <button className='send-button'>Send</button>
      </form>
    </div>
  );
};

export default Chat;
