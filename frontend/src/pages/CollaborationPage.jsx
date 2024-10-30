import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import withAuth from "../hoc/withAuth";
import io from 'socket.io-client';
import Tabs from '../components/collaboration/Tabs';
import CodePanel from '../components/collaboration/CodePanel';
import ConfirmationModal from '../components/collaboration/ConfirmationModal';

const socket = io('http://localhost:8084');

const CollaborationPage = () => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const { matchData } = location.state || { matchData: {} };
  const sessionId = matchData.sessionId;

  const updateElapsedTime = () => {
    const savedStartTime = localStorage.getItem('startTime');

    if (savedStartTime) {
      const startTime = parseInt(savedStartTime, 10);
      const currentTime = Math.floor(Date.now() / 1000);
      const elapsed = currentTime - startTime;
      setSecondsElapsed(elapsed);
    }
  };

  useEffect(() => {
    const savedStartTime = localStorage.getItem('startTime');

    if (!savedStartTime) {
      const currentTime = Math.floor(Date.now() / 1000);
      localStorage.setItem('startTime', currentTime.toString());
    }

    updateElapsedTime();

    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateElapsedTime();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleEndSession = () => {
    setShowModal(true); 
  };

  const handleConfirmEndSession = () => {
    socket.emit('endSession', sessionId);
    localStorage.removeItem('startTime');
    if (localStorage.getItem('partnerLeft')) {
      console.log("Deleting Session Data")
      fetch(`http://localhost:8084/sessions/${sessionId}`,
        {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionid: sessionId
        })
        }
      )
    }
    navigate('/summary', { state: { matchData, secondsElapsed } });
  };


  const handleCancelEndSession = () => {
    setShowModal(false); 
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100vh',
    padding: '20px',
    position: 'relative',
    background: 'none',
  };

  const timerStyle = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#fff',
  };

  const buttonStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#fff',
    color: '#1a3042',
    border: '2px solid #1a3042',
    borderRadius: '15px',
    cursor: 'pointer',
    fontSize: '16px',
    fontFamily: 'Figtree',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const contentContainerStyle = {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    gap: '20px',
    marginTop: '70px',
    width: '100%',
    overflow: 'hidden',
  };


  const leftPaneStyle = {
    flex: 1,
    padding: '6px',
  };

  const rightPaneStyle = {
    flex: 2,
    padding: '6px',
    overflow: 'hidden',
    maxWidth: '100%',
  };


  return (
    <div style={containerStyle}>
      <div style={timerStyle}>Time Elapsed: {formatTime(secondsElapsed)}</div>
      <button
        onClick={handleEndSession}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#1a3042';
          e.target.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#fff';
          e.target.style.color = '#1a3042';
        }}
      >
        End Session
      </button>

      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showModal}
        onConfirm={handleConfirmEndSession}
        onCancel={handleCancelEndSession}
      />

      {/* Main Content Section */}
      <div style={contentContainerStyle}>
        {/* Left Pane with Tabs */}
        <div style={leftPaneStyle}>
          <Tabs question={matchData.question} sessionId={sessionId} />
        </div>
        {/* Right Pane with Code Panel */}
        <div style={rightPaneStyle}>
          <CodePanel sessionId={sessionId} />
        </div>
      </div>
    </div>
  );
};

const WrappedCollaborationPage = withAuth(CollaborationPage);
export default WrappedCollaborationPage;
