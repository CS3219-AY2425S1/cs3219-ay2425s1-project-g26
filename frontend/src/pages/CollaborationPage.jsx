import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CollaborationPage = () => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEndSession = () => {
    navigate('/dashboard');
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
    </div>
  );
};

export default CollaborationPage;
