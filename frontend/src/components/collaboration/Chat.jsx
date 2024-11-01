import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const Chat = ({ sessionId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('');
  const [socket, setSocket] = useState(null);

  const textareaRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:8084');
    setSocket(newSocket);
    console.log('set socket');
    newSocket.emit('join', sessionId);

    return () => {
      newSocket.disconnect();
    };
  }, [sessionId]);

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
        console.log('received');
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

    console.log(newMessage)

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
      // textareaRef.current.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <h3>Chat</h3>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <div>{msg.username}</div> 
            <div>{msg.message}</div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button>Send</button>
      </form>
    </div>
  );
};

export default Chat;

