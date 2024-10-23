import React from 'react';

const Tabs = () => {
  const containerStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    height: '100%',
  };

  const headingStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1a3042',
  };

  const tabStyle = {
    margin: '10px 0',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Tabs</h2>

    </div>
  );
};

export default Tabs;
