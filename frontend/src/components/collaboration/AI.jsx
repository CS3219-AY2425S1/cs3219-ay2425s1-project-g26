import React, { useState } from 'react';
import './AI.css'; 

const AI = ({ messages, setMessages, inputValue, setInputValue }) => {
  const [loading, setLoading] = useState(false); 

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue) return;

    // Add user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputValue, sender: 'user' },
    ]);

    setLoading(true);

    try {
      setInputValue('');
      // Call the AI backend API
      const response = await fetch('http://localhost:9680/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Error with AI response');
      }

      const data = await response.json();
      const aiMessage = data.message;

      // Add AI's message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: aiMessage, sender: 'ai' },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Sorry, something went wrong.', sender: 'ai' },
      ]);
    }

    setLoading(false);
    setInputValue('');
  };

  const renderMessage = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="chat-container">
      <h3>Chat with Raesa</h3>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <strong>{msg.sender === 'user' ? 'You:' : 'Raesa:'}</strong> {renderMessage(msg.text)}

          </div>
        ))}
        {loading && <div className="loading">Loading...</div>}
      </div>
      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message here..."
          className="message-input"
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
        />
        <button type="submit" className="send-button">Send</button>
      </form>
    </div>
  );
};

export default AI;
