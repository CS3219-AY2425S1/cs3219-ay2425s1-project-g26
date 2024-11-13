import React from 'react';

const Toast = ({ message, type }) => {
  const backgroundColor = type === 'error' ? '#ff4d4f' : '#4CAF50';

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor,
      color: 'white',
      padding: '10px 20px',
      borderRadius: '8px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
      zIndex: 1000,
      fontFamily: 'Figtree, sans-serif',
      fontSize: '1rem',
      textAlign: 'center',
    }}>
      {message}
    </div>
  );
};

export default Toast;
