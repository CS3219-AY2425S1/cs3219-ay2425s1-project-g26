/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import the AuthContext
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons for showing/hiding password

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Access the login function from AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8081/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          throw new Error('Wrong email and/or password');
        } else {
          throw new Error(errorData.message || 'An error occurred, please try again.');
        }
      }

      const data = await response.json();
      
      // Use the login function from AuthContext to store the token in context
      login(data.data.accessToken);

      // Navigate to the dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ fontSize: '4rem' }}>PeerPrep</h1> 
      <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>Welcome back! Let’s get back on track.</p> 
      
      {notificationMessage && <p style={{ color: '#8BC34A' }}>{notificationMessage}</p>} {/* notification message color */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      
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
        <p style={{ margin: '0', color: 'white', fontSize: '0.9rem', textAlign: 'right', width: '300px' }}>
          <a href="/forget-password" style={{ color: 'white' }}>Forgot your password?</a> 
        </p>
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
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p style={{ fontSize: '1rem' }}> 
        Don't have an account? <a href="/signup" style={{ color: 'white' }}>Sign Up</a>
      </p>
    </div>
  );
};

// Same styles applied for placeholders
const styles = `
  input::placeholder {
    color: white; 
    opacity: 0.8; 
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Login;
