import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import withAuth from "../hoc/withAuth";
import axios from 'axios';

const WaitingPage = () => {
  const location = useLocation();
  const { userPref } = location.state || { userPref: {} };
  const navigate = useNavigate();

  const [requestInProgress, setRequestInProgress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [matchFound, setMatchFound] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [matchData, setMatchData] = useState(null);
  
  let intervalId, timeoutId;
  const hasRequestedRef = useRef(false); 

  useEffect(() => {
    if (!userPref || Object.keys(userPref).length === 0) {
      navigate('/new-session');
    } else {
      if (loading && !hasRequestedRef.current) {
        hasRequestedRef.current = true; 
        createMatchRequest(userPref);
      }
    }
  }, [navigate, userPref, loading]); 

  const createMatchRequest = async (userPref) => {
    console.log("MATCHINGG");
    if (requestInProgress) return; 
    setRequestInProgress(true); 

    try {
      const response = await axios.post('http://localhost:8082/matches', userPref);

      if (response.status === 200 || response.status === 201) {
        if (response.data.matched) {
          setMatchFound(true);
          setMatchData(response.data);
          
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error', error.message);
    } finally {
      setRequestInProgress(false); 
    }
  };

  useEffect(() => {
    if (loading && !matchFound) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);

      timeoutId = setTimeout(() => {
        setLoading(false);
        setTimeoutReached(true);
      }, 35000); 

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, [loading, matchFound]);

  const handleRetry = () => {
    setLoading(true);
    setMatchFound(false);
    setTimeoutReached(false);
    setSeconds(0);
    setRequestInProgress(false);
    createMatchRequest(userPref);
  };

  const handleGoHome = async (event) => {
    event.stopPropagation(); 
    try {
      navigate('/dashboard');
      const response = await fetch(
        `http://localhost:8082/matches/${userPref.id}`,
        {
          method: "DELETE",
          body: JSON.stringify(userPref),
        }
      );
      if (response.status === 200) {
        setMatchFound(false);
      }
    } catch (error) {
      console.error('Error deleting match request:', error);
      navigate('/dashboard');
    }
  };

  const buttonStyle = (isHovered) => ({
    padding: "15px 30px",
    backgroundColor: isHovered ? "#2a4b5e" : "#1a3042", 
    color: "#fff", 
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    fontSize: '16px',
    fontFamily: 'Figtree',
    margin: '10px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
  });

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    textAlign: 'center',
    padding: '20px',
  };

  const messageStyle = {
    fontSize: '2.5rem',
    marginBottom: '20px',
    fontWeight: 'bold',
    color: '#1a3042', 
  };

  const subMessageStyle = {
    fontSize: '1.5rem',
    margin: '10px 0',
    color: '#1a3042', 
  };

  const timerStyle = {
    fontSize: '2rem',
    marginBottom: '20px',
  };

  const cardStyle = {
    backgroundColor: '#fff', 
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
    color: '#1a3042',
    width: '80%',
    maxWidth: '600px',
    textAlign: 'center',
  };

  const headingStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#1a3042', 
  };

  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    if (matchFound && matchData) {
      const timeout = setTimeout(() => {
        navigate('/collaboration-page', { state: { matchData } });
      }, 3000); 
      return () => clearTimeout(timeout);
    }
  }, [matchFound, matchData, navigate]);

  return (
    <div style={containerStyle}>
      {loading ? (
        <div style={cardStyle}>
          <p style={messageStyle}>🔍 Searching for a match... <span className="spinner"></span></p>
          <p style={timerStyle}>Time Elapsed: {seconds} seconds</p>
          <button 
            onClick={handleGoHome} 
            style={buttonStyle(hoveredButton === 'cancel')}
            onMouseEnter={() => setHoveredButton('cancel')} 
            onMouseLeave={() => setHoveredButton(null)}
          >
            Cancel
          </button>
        </div>
      ) : (
        matchFound && matchData ? (
          <div style={cardStyle}>
            <p style={headingStyle}>🎉 Match found!</p>
            <p style={subMessageStyle}>You're matched with <strong>@{matchData.matchedUserName}</strong>.</p>
            <p style={subMessageStyle}>
              <strong>Complexity:</strong> {`${matchData.complexity.charAt(0).toUpperCase()}${matchData.complexity.slice(1)}`}
            </p>
            <p style={subMessageStyle}>
              <strong>Category:</strong> {matchData.category.join(', ')}
            </p>
            <p style={subMessageStyle}>Starting the collaboration room now...</p>
          </div>
        ) : timeoutReached ? (
          <div style={cardStyle}>
            <p style={headingStyle}>😞 No match found.</p>
            <p style={subMessageStyle}>Unfortunately, no match was found in the given time.</p>
            <button 
              onClick={handleRetry} 
              style={buttonStyle(hoveredButton === 'retry')}
              onMouseEnter={() => setHoveredButton('retry')} 
              onMouseLeave={() => setHoveredButton(null)}
            >
              Retry
            </button>
            <button 
              onClick={handleGoHome} 
              style={buttonStyle(hoveredButton === 'goHome')}
              onMouseEnter={() => setHoveredButton('goHome')} 
              onMouseLeave={() => setHoveredButton(null)}
            >
              Go Back to Home
            </button>
          </div>
        ) : null
      )}
    </div>
  );
};

const WrappedWaitingPage = withAuth(WaitingPage);
export default WrappedWaitingPage;
