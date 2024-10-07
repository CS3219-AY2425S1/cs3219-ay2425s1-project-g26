import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const SignUp = () => {
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Simple email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred, please try again');
      }

      // Handle successful response
      const data = await response.json(); 
      console.log(data);
      
      // Store the notification message in localStorage
      localStorage.setItem('signupNotification', `You have successfully created an account @${username}`);

      navigate('/login');
      
    } catch (error) {
      setErrorMessage(error.message); // Set the error message to display
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '4rem' }}>PeerPrep</h1> 
      <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>Create an account to get started.</p> 
      
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Error message */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="text" // Username field
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            display: 'block',
            margin: '10px 0',
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
        <div style={{ position: 'relative', width: '300px' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              display: 'block',
              margin: '0px 0',
              padding: '10px',
              width: '100%',
              border: 'none',
              borderBottom: '2px solid #fff',
              outline: 'none',
              backgroundColor: 'transparent',
              color: '#fff',
              fontSize: '16px',
            }}
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              color: '#fff',
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />} 
          </div>
        </div>
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
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      <p style={{ fontSize: '1rem' }}> 
        Already have an account? <a href="/login" style={{ color: 'white' }}>Login</a>
      </p>
    </div>
  );
};

// CSS for spinner animation
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

export default SignUp;