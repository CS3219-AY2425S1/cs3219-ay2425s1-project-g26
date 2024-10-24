import React, { useState } from 'react';
import Question from './Question';
import Chat from './Chat'; 
import AI from './AI';  

const Tabs = ({ question }) => {
  const [selectedTab, setSelectedTab] = useState('Question');
  
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInputValue, setAiInputValue] = useState('');

  const containerStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    height: '100%',
  };

  const tabContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between', 
  };

  const tabStyle = {
    flex: 1,
    margin: '10px 0',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    textAlign: 'center',
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: '#e0e0e0', 
    fontWeight: 'bold',
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'Question':
        return <Question question={question} />;
      case 'Chat':
        return <Chat />;
      case 'AI':
        return (
          <AI 
            messages={aiMessages}
            setMessages={setAiMessages}
            inputValue={aiInputValue}
            setInputValue={setAiInputValue}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={containerStyle}>
      {/* Tab Buttons */}
      <div style={tabContainerStyle}>
        <div
          style={selectedTab === 'Question' ? activeTabStyle : tabStyle}
          onClick={() => setSelectedTab('Question')}
        >
          Question
        </div>
        <div
          style={selectedTab === 'Chat' ? activeTabStyle : tabStyle}
          onClick={() => setSelectedTab('Chat')}
        >
          Chat
        </div>
        <div
          style={selectedTab === 'AI' ? activeTabStyle : tabStyle}
          onClick={() => setSelectedTab('AI')}
        >
          AI
        </div>
      </div>

      {/* Render Selected Tab Content */}
      <div style={{ marginTop: '20px' }}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Tabs;
