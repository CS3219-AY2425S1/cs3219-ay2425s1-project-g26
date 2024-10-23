import React from 'react';

const CodePanel = () => {
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

  const codeBlockStyle = {
    backgroundColor: '#f4f4f4',
    padding: '15px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '1rem',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Code</h2>
      <div style={codeBlockStyle}>
        {'// code will appear here\nconst example = "raesa";\nconsole.log(example);'}
      </div>
    </div>
  );
};

export default CodePanel;
