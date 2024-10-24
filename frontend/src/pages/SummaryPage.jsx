import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SummaryPage = () => {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false); 

  const handleNavigateToDashboard = () => {
    navigate('/dashboard'); 
  };

  const handleNavigateToCollaboration = () => {
    navigate('/collaboration'); 
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Summary</h1>

      <div style={styles.buttonContainer}>
        <button
          style={{
            ...styles.button,
            backgroundColor: hover ? '#1a3042' : '#fff', 
            color: hover ? '#fff' : '#1a3042', 
          }}
          onClick={handleNavigateToDashboard}
          onMouseEnter={() => setHover(true)} 
          onMouseLeave={() => setHover(false)} 
        >
          Go to Dashboard
        </button>

        {/* <button
          style={{
            ...styles.button,
            backgroundColor: hover ? '#1a3042' : '#fff', 
            color: hover ? '#fff' : '#1a3042',
          }}
          onClick={handleNavigateToCollaboration}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
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
  },
  title: {
    color: '#fff', 
    fontSize: '36px', 
    marginBottom: '280px', 
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#fff', 
    color: '#1a3042',   
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s, color 0.3s',
  },
};

export default SummaryPage;
