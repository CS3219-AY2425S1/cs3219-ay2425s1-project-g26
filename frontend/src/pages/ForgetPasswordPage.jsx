import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State to manage loading
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call API to handle password reset logic
      // Assume password reset is always successful for now
      navigate('/login'); // Navigate to the login page after successful reset
    } catch (error) {
      setErrorMessage('An error occurred, please try again'); // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '4rem' }}>PeerPrep</h1>
      <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>Reset your password.</p>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Error message */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          {isLoading ? 'Sending...' : 'Reset Password'}
        </button>
      </form>
      <p style={{ fontSize: '1rem' }}>
        Remembered your password? <a href="/login" style={{ color: 'white' }}>Login</a>
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
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ForgetPassword;
