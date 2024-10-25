import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8084');

const CodePanel = ({ sessionId }) => {
  const defaultCodes = {
    javascript: `// JavaScript code
const example = "raesa";
console.log(example);`,

    python: `# Python code
def main():
    example = "raesa"
    print(example)

if __name__ == "__main__":
    main()`,

    java: `// Java code
public class Main {
  public static void main(String[] args) {
    String example = "raesa";
    System.out.println(example);
  }
}`,
  };

  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(defaultCodes[language]);
  const [output, setOutput] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); 

  useEffect(() => {
    // Join the session
    socket.emit('join', sessionId);

    // Listen for code updates from other users
    socket.on('codeUpdate', (code) => {
      setCode(code);
    });

    // Listen for language and code updates from other users
    socket.on('languageUpdate', (newLanguage, newCode) => {
      setLanguage(newLanguage);
      setCode(newCode); // Update the code to the new default
      setOutput('');
    });

    return () => {
      socket.off('codeUpdate');
      socket.off('languageUpdate');
    };
  }, [sessionId]);

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    const newCode = defaultCodes[selectedLanguage]; 

    setLanguage(selectedLanguage);
    setCode(newCode);
    setOutput('');

    // Emit the language change and new code to the server
    socket.emit('languageChange', sessionId, selectedLanguage, newCode);
  };

  const handleCodeChange = (event) => {
    const newCode = event.target.value;
    setCode(newCode);
    socket.emit('codeChange', sessionId, newCode); // Emit code change
  };

  const handleRunCode = async () => {
    setOutput('');
    setIsButtonDisabled(true);

    const requestBody = {
      code: code,
      language: language,
    };

    try {
      const response = await fetch('http://localhost:8083/run-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      
      if (result.error) {
        setOutput(`Error: ${result.error}`); 
      } else {
        setOutput(result.output);
      }

    } catch (error) {
      setOutput(`Error: ${error.message}`);  
    }

    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 2000);
  };

  const containerStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    height: '100%',
    position: 'relative',
  };

  const headingStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1a3042',
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '5px',
    fontSize: '1rem',
    fontFamily: 'monospace',
  };

  const textareaStyle = {
    width: '100%',
    height: '400px',
    padding: '15px',
    backgroundColor: '#f4f4f4',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '1rem',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    resize: 'none',
    outline: 'none',
  };

  const outputStyle = {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '1rem',
    whiteSpace: 'pre-wrap',
    border: '1px solid #ddd',
    maxHeight: '200px', 
    overflowY: 'auto', 
  };

  const buttonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: isButtonDisabled ? '#ccc' : '#1a3042', 
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
    fontSize: '1rem',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Code</h2>
      <select style={dropdownStyle} value={language} onChange={handleLanguageChange}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>
      <textarea
        style={textareaStyle}
        value={code}
        onChange={handleCodeChange}
      />
      <button
        style={buttonStyle}
        onClick={handleRunCode}
        disabled={isButtonDisabled} 
      >
        Run Code
      </button>
      <div style={outputStyle}>
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodePanel;
