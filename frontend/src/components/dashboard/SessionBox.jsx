import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionBox = ({ headerText, sessionText, buttonText, buttonLink }) => {
  const navigate = useNavigate();
  
  // State to track if the button is hovered
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        borderRadius: "10px",
        backgroundColor: "#fff",
        padding: "20px",
        width: "350px",
        height: "200px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginRight: "20px",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20px' 
      }}
    >
      <h2 style={{ margin: "0 0 10px 0" }}>{headerText}</h2>
      <p style={{ margin: "0", color: "#333", textAlign: 'center' }}>
        {sessionText}
      </p>
      <button
        onClick={() => navigate(buttonLink)}
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)} 
        style={{
          marginTop: "30px",
          padding: "15px 30px",
          backgroundColor: isHovered ? '#2a4b5e' : '#1a3042', 
          color: "#fff",
          border: "none",
          borderRadius: "15px",
          cursor: "pointer",
          fontSize: '16px',
          fontFamily: 'Figtree',
          transition: "background-color 0.3s",
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default SessionBox;
