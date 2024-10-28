import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../AuthContext"; 
import axios from 'axios';

const SummaryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, userId } = useAuth();
  const [hoverDashboard, setHoverDashboard] = useState(false);
  const [hoverCollaboration, setHoverCollaboration] = useState(false);

  const { matchData = {}, secondsElapsed = 0 } = location.state || {};
  const { question = {} } = matchData;

  const handleNavigateToDashboard = () => {
    navigate('/dashboard'); 
  };

  const handleNavigateToCollaboration = () => {
    navigate('/collaboration'); 
  };

  useEffect(() => {
    localStorage.removeItem('isMatched');
    localStorage.removeItem('matchData');
    localStorage.removeItem('codeState');

    const updateMatchedStatus = async () => {
      try {
        const response = await axios.patch(`http://localhost:8081/users/${userId}/matched`, {
          isMatched: false,
          matchData: {},
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        if (response.status === 200) {
          console.log('Matched status updated successfully');
        } else {
          console.error('Failed to update matched status:', response.data);
        }
      } catch (error) {
        console.error('Error updating matched status:', error);
      }
    };

    updateMatchedStatus();
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Session Summary</h1>
      
      <div style={styles.summaryCard}>
        <div style={styles.summaryRow}><span>Time Elapsed:</span> {formatTime(secondsElapsed)}</div>
        <div style={styles.summaryRow}><span>Question Title:</span> {question.title || "N/A"}</div>
        <div style={styles.summaryRow}><span>Complexity:</span> {question.complexity || "N/A"}</div>
      </div>

      <div style={styles.buttonContainer}>
        <button
          style={{
            ...styles.button,
            backgroundColor: hoverDashboard ? '#1a3042' : '#fff', 
            color: hoverDashboard ? '#fff' : '#1a3042', 
          }}
          onClick={handleNavigateToDashboard}
          onMouseEnter={() => setHoverDashboard(true)} 
          onMouseLeave={() => setHoverDashboard(false)} 
        >
          Go to Dashboard
        </button>

        {/* <button
          style={{
            ...styles.button,
            backgroundColor: hoverCollaboration ? '#1a3042' : '#fff', 
            color: hoverCollaboration ? '#fff' : '#1a3042',
          }}
          onClick={handleNavigateToCollaboration}
          onMouseEnter={() => setHoverCollaboration(true)}
          onMouseLeave={() => setHoverCollaboration(false)}
        >
          Back to Collaboration
        </button> */}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    color: '#fff',
  },
  title: {
    color: '#fff', 
    fontSize: '36px', 
    marginBottom: '30px', 
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  summaryCard: {
    backgroundColor: '#1a3042',
    color: '#fff',
    padding: '30px 40px',
    borderRadius: '15px',
    marginBottom: '30px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    width: '80%',
    maxWidth: '500px',
  },
  summaryRow: {
    margin: '15px 0',
    fontSize: '18px',
    lineHeight: '1.6',
    borderBottom: '1px solid #3a4d5c',
    paddingBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    gap: '15px',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#fff', 
    color: '#1a3042',   
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
  },
};

export default SummaryPage;
