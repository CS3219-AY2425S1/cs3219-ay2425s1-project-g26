import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chat = ({ sessionId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('');

  const textareaRef = useRef(null);

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
      textareaRef.current.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
      <div>
        <h3>Chat Component</h3>
        <p>This is the Chat tab content.</p>
      </div>
    );
  };

export default Chat;

