import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import withAuth from "../hoc/withAuth";
import { useAuth } from '../AuthContext';
import io from 'socket.io-client';
import Tabs from '../components/collaboration/Tabs';
import CodePanel from '../components/collaboration/CodePanel';
import ConfirmationModal from '../components/collaboration/ConfirmationModal';
import { Toaster } from 'sonner';

const socket = io('http://localhost:8084');

const CollaborationPage = () => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { login, accessToken, userId } = useAuth();

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

  const findBestAttempt = (attempts) => {
    let bestAttempt;
    if (attempts.length < 1) {
      bestAttempt = {
        language: 'None',
        content: '',
        testCases: [],
      }
      return bestAttempt;
    } 
    let testCases = 0;
    let highestScore = 0;

    for (let i = 0; i < attempts.length; i++) {
      let score = 0;
      if (attempts[i].testCases.length == 0) {
        continue
      } else {
        testCases = attempts[i].testCases.length;
        score = attempts[i].testCases.filter(Boolean).length;
        if (score >= highestScore) {
          highestScore = score;
          bestAttempt = attempts[i];
        }
      }
    }
    if (testCases == 0) {
      bestAttempt = attempts[attempts.length - 1];
    }
    return bestAttempt
  };

  const formatTimeTaken = () => {
    const hours = Math.floor(secondsElapsed / 3600);
    const minutes = Math.floor((secondsElapsed % 3600) / 60);
    const seconds = secondsElapsed % 60;

    if (hours > 0) {
      return `${hours}:${minutes}:${seconds}`;
    } else {
      return `${minutes}:${seconds}`;
    }
  }

  const handleConfirmEndSession = () => {
    socket.emit('endSession', sessionId);
    const currentSavedTime = localStorage.getItem('startTime')
    const attempts = fetch(`http://localhost:8084/sessions/${sessionId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    ).then((attempts) => attempts.json())
    .then((attempts) => findBestAttempt(attempts.pastAttempts))
    .then((bestAttempt) => {
      const attemptDate = new Date(parseInt(currentSavedTime, 10) * 1000);
      //Save history data
      fetch(`http://localhost:8081/users/history/${userId}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: matchData.question,
            partner: matchData.matchedUserName,
            startDateTime: attemptDate.toLocaleString('en-SG', {timeZone: 'Asia/Singapore'}),
            attempt: bestAttempt,
            timeTaken: formatTimeTaken(),
          })
        }
      )
    })
    if (localStorage.getItem('partnerLeft')) {
      localStorage.removeItem('partnerLeft')
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
    localStorage.removeItem('startTime');
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
        Leave Session
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
          <Tabs question={matchData.question} sessionId={sessionId} socket={socket} userId={userId} />
        </div>
        {/* Right Pane with Code Panel */}
        <div style={rightPaneStyle}>
          <CodePanel question={matchData.question} sessionId={sessionId} socket={socket}  />
        </div>
      </div>
      <Toaster closeButton richColors position="top-center" />
    </div>
  );
};

const WrappedCollaborationPage = withAuth(CollaborationPage);
export default WrappedCollaborationPage;
