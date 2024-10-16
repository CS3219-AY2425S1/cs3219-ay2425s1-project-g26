import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import withAuth from "../hoc/withAuth"; 

const WaitingPage = () => {
  const location = useLocation();
  const { userPref } = location.state || { userPref: {} };
  const [loading, setLoading] = useState(true);
  const [matchFound, setMatchFound] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timeoutReached, setTimeoutReached] = useState(false); 
  const navigate = useNavigate(); 

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000); //timer
  
      const timer = setTimeout(() => {
        setLoading(false);
        if (!matchFound) {
          setTimeoutReached(true); 
        }
      }, 30000);  // 30 seconds max waiting time
  
      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [loading, matchFound]);

  const handleRetry = () => {
    // need to re-add user into queue using the same choices here
    setLoading(true); 
    setMatchFound(false);
    setTimeoutReached(false);
    setSeconds(0); 
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const buttonStyle = {
    padding: "15px 30px", 
    backgroundColor: "#fff", 
    color: "#000",
    border: "none",
    borderRadius: "15px",
    cursor: "pointer",
    fontSize: '16px',
    fontFamily: 'Figtree',
    margin: '10px',
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    color: 'white',
    flexDirection: 'column',
    textAlign: 'center',
    padding: '20px',
  };

  const messageStyle = {
    fontSize: '3rem',
    marginBottom: '20px',
  };

  const timerStyle = {
    fontSize: '2rem',
    marginBottom: '20px',
  };

  return (
    <div style={containerStyle}>
      {loading ? (
        <>
          <p style={messageStyle}>Searching for a match... <span className="spinner"></span></p>
          {/* Conditionally show the timer below the message */}
          {!timeoutReached && (
            <>
              <p style={timerStyle}>Time Elapsed: {seconds} seconds</p>
              {/* Cancel Button */}
              <button
                onClick={handleGoHome}
                style={buttonStyle}
              >
                Cancel
              </button>
            </>
          )}
        </>
      ) : (
        matchFound ? (
          <p style={messageStyle}>Match found! Starting the collaboration room.</p>
        ) : timeoutReached ? (
          <div>
            <p style={messageStyle}>Sorry, no match was found.</p>

            {/* Retry Button */}
            <button
              onClick={handleRetry}
              style={buttonStyle}
            >
              Retry
            </button>

            {/* Go Back to Home Button */}
            <button
              onClick={handleGoHome}
              style={buttonStyle}
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
