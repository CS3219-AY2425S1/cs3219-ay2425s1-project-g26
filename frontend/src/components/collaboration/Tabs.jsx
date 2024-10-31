import React, { useState, useRef } from 'react';
import Question from './Question';
import Chat from './Chat'; 
import AI from './AI';  
import Whiteboard from './Whiteboard';

const Tabs = ({ question, sessionId, socket }) => {
  const [selectedTab, setSelectedTab] = useState('Question');
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInputValue, setAiInputValue] = useState('');

  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const canvasRef = useRef(null);
  const [savedCanvasData, setSavedCanvasData] = useState(null);

  const saveCanvasData = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      setSavedCanvasData(dataUrl);
    }
  };

  const handleTabChange = (tabName) => {
    if (selectedTab === 'Whiteboard') {
      saveCanvasData();
    }
    setSelectedTab(tabName);
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
      case 'Whiteboard': 
        return (
          <Whiteboard 
            color={color} 
            setColor={setColor} 
            lineWidth={lineWidth} 
            setLineWidth={setLineWidth}
            canvasRef={canvasRef} 
            savedCanvasData={savedCanvasData} 
            sessionId={sessionId}
            currSocket={socket}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', height: '100%' }}>
      {/* Tab Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {['Question', 'Chat', 'AI', 'Whiteboard'].map((tab) => (
          <div
            key={tab}
            style={{
              flex: 1,
              margin: '10px 0',
              padding: '10px',
              backgroundColor: selectedTab === tab ? '#e0e0e0' : '#f0f0f0',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem',
              textAlign: 'center',
              fontWeight: selectedTab === tab ? 'bold' : 'normal'
            }}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Render Selected Tab Content */}
      <div style={{ marginTop: '20px' }}>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Tabs;
