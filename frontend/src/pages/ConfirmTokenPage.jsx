import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ConfirmToken = () => {
  const location = useLocation();
  const email = location.state?.email; 
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Submitting token:", token); 

    try {
      const response = await axios.post('http://localhost:8081/users/confirm-token', { token });

      console.log("Response:", response); 

      if (response.status === 200) {
        alert("Token confirmed! You can now reset your password.");
        navigate('/reset-password', { state: { token } });
      }
    } catch (error) {
      console.error("Error confirming token:", error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message); 
      } else {
        setErrorMessage('An error occurred, please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);

    try {
      const response = await axios.post('http://localhost:8081/users/forgot-password', { email });

      if (response.status === 200) {
        alert("Token resent to your email.");
      }
    } catch (error) {
      alert('Failed to resend token. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '20px'}}>PeerPrep</h1>
      <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>Enter your token to confirm.</p>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Error message */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Enter token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          style={{
            display: 'block',
            margin: '10px 0',
            marginTop: '50px',
            padding: '10px',
            width: '300px',
            border: 'none',
            borderBottom: '2px solid #fff',
            outline: 'none',
            backgroundColor: 'transparent',
            color: '#fff',
            fontSize: '16px',
          }}
        />
        <button
          type="submit"
          style={{
            width: '300px',
            height: '50px',
            backgroundColor: 'white',
            color: 'black',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '16px',
            marginTop: '20px',
            marginBottom: '40px',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          disabled={isLoading}
        >
          {isLoading ? 'Verifying...' : 'Confirm Token'}
        </button>
      </form>
      <p style={{ fontSize: '1rem' }}>
        Didn't receive a token?{' '}
        <span
          style={{
            textDecoration: 'underline',
            cursor: 'pointer',
            color: 'white'
          }}
          onClick={handleResend}
        >
          Resend
        </span>
        {isResending && <span style={{ marginLeft: '10px' }}>Resending...</span>}
      </p>
    </div>
  );
};

const styles = `
  input::placeholder {
    color: white;
    opacity: 0.8;
  }
`;

// Append styles to the head
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ConfirmToken;
