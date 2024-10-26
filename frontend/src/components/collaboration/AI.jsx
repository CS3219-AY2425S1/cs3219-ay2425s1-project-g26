import React, { useState, useEffect, useRef } from 'react';
import './styles/AI.css'; 

const AI = ({ messages, setMessages, inputValue, setInputValue }) => {
  const [loading, setLoading] = useState(false); 
  const textareaRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue) return;

    // Add user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputValue, sender: 'user' },
    ]);

    setLoading(true);
    setInputValue(''); 

    try {
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
    } finally {
      setLoading(false); 
    }
  };

  const renderMessage = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        setInputValue((prev) => prev + '\n');
        e.preventDefault();
      } else {
        handleSendMessage(e);
      }
    }
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${Math.max(textarea.scrollHeight, 60)}px`;

        if (inputValue === '') {
            textarea.style.height = '60px'; 
        }
    }
}, [inputValue]);

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
        <textarea
          ref={textareaRef} 
          value={inputValue}
          onChange={handleInput}
          placeholder="Type your message here..."
          className="message-input"
          onKeyDown={handleKeyDown} 
          disabled={loading}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AI;
