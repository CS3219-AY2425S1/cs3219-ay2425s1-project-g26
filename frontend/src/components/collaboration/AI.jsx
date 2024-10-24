import React from 'react';

const AI = ({ messages, setMessages, inputValue, setInputValue }) => {
  const [loading, setLoading] = React.useState(false);

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

  return (
    <div>
      <h3>Chat with AI</h3>
      <div className="chat-window" style={{ border: '1px solid #ccc', padding: '10px', height: '500px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <strong>{msg.sender === 'user' ? 'You:' : 'AI:'}</strong> {msg.text}
          </div>
        ))}
        {loading && <div>Loading...</div>}
      </div>
      <form onSubmit={handleSendMessage} style={{ display: 'flex', marginTop: '10px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message here..."
          style={{ flex: 1, padding: '5px' }}
        />
        <button type="submit" style={{ padding: '5px 10px' }}>Send</button>
      </form>
    </div>
  );
};

export default AI;
