import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Question from './Question';
import Chat from './Chat';
import AI from './AI';
import Whiteboard from './Whiteboard';

const Tabs = ({ question, sessionId, socket, userId }) => {
  const [selectedTab, setSelectedTab] = useState('Question');
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInputValue, setAiInputValue] = useState('');

  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const canvasRef = useRef(null);
  const [savedCanvasData, setSavedCanvasData] = useState(null);

  const [user1Id, setUser1Id] = useState('');
  const [user2Id, setUser2Id] = useState('');

  // Get user1Id and user2Id from match db and add into chat db
  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        console.log(sessionId)
        const response = await axios.get(`http://localhost:8082/matches/session/${sessionId}`);
        console.log(response);
        const tempUser1Id = response.data[0].user1Id;
        const tempUser2Id = response.data[0].user2Id;

        setUser1Id(tempUser1Id);
        setUser2Id(tempUser2Id);

        console.log("User1 ID set to:", tempUser1Id);
        console.log("User2 ID set to:", tempUser2Id);

        // Call createChatSession here after user IDs are set
        await createChatSession(sessionId, tempUser1Id, tempUser2Id);

      } catch (error) {
        console.error('Error fetching match details:', error);
      }
    };

    const createChatSession = async (sessionId, user1Id, user2Id) => {
        if (!sessionId || !user1Id || !user2Id) {
            console.error('Missing required fields:', { sessionId, user1Id, user2Id });
            return;
        }

        try {
            const chatData = { sessionId, user1Id, user2Id };
            console.log('Sending chat data:', chatData);

            const response = await axios.post('http://localhost:8085/chats', chatData);
            console.log('Chat session created:', response.data);
        } catch (error) {
            console.error('Error creating chat session:', error);
        }
    };

    fetchMatchDetails();
  }, [sessionId]);

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
        return <Chat sessionId={sessionId} userId={userId} />;
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

