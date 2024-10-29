import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Make sure to install axios

const Chat = ({ sessionId, userId }) => {
  const [messages, setMessages] = useState([]); // State to hold messages
  const [inputValue, setInputValue] = useState(''); // State for input value
  const textareaRef = useRef(null);

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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue) return;

    const newMessage = { userId: userId, message: inputValue };
    console.log(newMessage);

    try {
      await axios.post(`http://localhost:8085/chats/${sessionId}`, newMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { userId: newMessage.userId, message: inputValue, timeSent: new Date() },
      ]);
      setInputValue(''); // Clear input after sending
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
