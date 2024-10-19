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
  
  let intervalId, timeoutId;

  const createMatchRequest = async (userPref) => {
    try {
      console.log(userPref);
      const response = await axios.post('http://localhost:8082/matches', userPref);

      if (response.status === 200 || response.status === 201) {
        if (response.data.matched) {
          // Immediately handle match found state and clear timers
          setMatchFound(true);
          console.log('Match found:', response.data);
          
          clearInterval(intervalId);  // Stop the interval for updating seconds
          clearTimeout(timeoutId);    // Clear the 30s timeout
          setLoading(false);          // Ensure the loading stops immediately
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
    if (loading && !matchFound) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);

      timeoutId = setTimeout(() => {
        setLoading(false);
        setTimeoutReached(true); // Set timeoutReached after 30 seconds
      }, 30000);  // 30 seconds max waiting time

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, [loading, matchFound]);

  useEffect(() => {
    if (!loading && !matchFound && !timeoutReached) {
      // Ensure timeout state is updated if no match was found and loading stopped
      setTimeoutReached(true);
    }
  }, [loading, matchFound]);

  const handleRetry = () => {
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
      console.log('Response:', response.data);
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
          {!timeoutReached && (
            <>
              <p style={timerStyle}>Time Elapsed: {seconds} seconds</p>
              <button onClick={handleGoHome} style={buttonStyle}>Cancel</button>
            </>
          )}
        </>
      ) : (
        matchFound ? (
          <p style={messageStyle}>Match found! Starting the collaboration room.</p>
        ) : timeoutReached ? (
          <div>
            <p style={messageStyle}>Sorry, no match was found.</p>
            <button onClick={handleRetry} style={buttonStyle}>Retry</button>
            <button onClick={handleGoHome} style={buttonStyle}>Go Back to Home</button>
          </div>
        ) : null
      )}
    </div>
  );
};

const WrappedWaitingPage = withAuth(WaitingPage);
export default WrappedWaitingPage;
