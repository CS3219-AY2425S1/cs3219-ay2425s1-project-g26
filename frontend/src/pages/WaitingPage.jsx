import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import withAuth from "../hoc/withAuth";
import axios from 'axios';

const WaitingPage = () => {
  const location = useLocation();
  const { userPref } = location.state || { userPref: {} };
  const navigate = useNavigate();

  const getHeaders = () => {
    return {
      "Content-Type": "application/json",
    };
  };

  // Check if userPref is not defined, redirect to NewSessionPage
  useEffect(() => {
    if (!userPref || Object.keys(userPref).length === 0) {
      navigate('/new-session'); // Redirect if userPref is missing
    } else {
      // Initiate match request on load
      createMatchRequest(userPref);
    }
  }, [navigate, userPref]);

  const [loading, setLoading] = useState(true);
  const [matchFound, setMatchFound] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timeoutReached, setTimeoutReached] = useState(false);

  const createMatchRequest = async (userPref) => {
    try {
      const response = await axios.post('http://localhost:8082/matches', userPref);

      // Check if the response status is 200 or 201 (success)
      if (response.status === 200 || response.status === 201) {
        // Check if the match was successful based on response data
        if (response.data.matched) {
          setMatchFound(true);
          console.log('Match found:', response.data);
        } else {
          console.log('No match found:', response.data);
        }
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
        console.error('Error', error.message);
    }
  };

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);

      const timer = setTimeout(() => {
        setLoading(false);
        setTimeoutReached(true); // Set timeoutReached after 30 seconds
      }, 30000);  // 30 seconds max waiting time

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [loading]);

   useEffect(() => {
      if (!loading && !matchFound) {
        // If loading has finished and no match found, update the state
        setTimeoutReached(true);
      }
   }, [loading, matchFound]);

  const handleRetry = () => {
    // re-add user into queue using the same choices here
    createMatchRequest(userPref);
    setLoading(true);
    setMatchFound(false);
    setTimeoutReached(false);
    setSeconds(0);
  };

  const handleGoHome = async () => {
    try {
      navigate('/dashboard');
      const response = await fetch(
              `http://localhost:8082/matches/${userPref.id}`,
              {
                method: "DELETE",
                headers: getHeaders(),
                body: JSON.stringify(userPref),
              }
            );
      console.log('Response:', response.data); // Log the response for debugging
      if (response.status === 200) {
        setMatchFound(false);
      }

    } catch (error) {
      console.error('Error deleting match request:', error);
      navigate('/dashboard');
    }
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