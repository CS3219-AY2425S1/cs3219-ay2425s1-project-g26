import React, { useState } from 'react';

const CodePanel = () => {
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

    c: `#include <stdio.h>

int main() {
  char example[] = "raesa";
  printf("%s\\n", example);
  return 0;
}`,
  };

  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(defaultCodes[language]);
  const [output, setOutput] = useState('');

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    setCode(defaultCodes[selectedLanguage]);
    setOutput(''); 
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const runJavaScriptCode = (userCode) => {
    try {
      const consoleOutput = [];
      const originalConsoleLog = console.log;
      console.log = (output) => consoleOutput.push(output);

      eval(userCode); 
      console.log = originalConsoleLog;

      setOutput(consoleOutput.join('\n'));
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleRunCode = () => {
    if (language === 'javascript') {
      runJavaScriptCode(code);
    } else {
      setOutput(`Running ${language} code is not supported directly in the browser.\nYou will be able to run ${language} code maybe tomorrow if i can do it fast.`);
    }
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
  };

  const buttonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#1a3042',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Code</h2>
      <select style={dropdownStyle} value={language} onChange={handleLanguageChange}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="c">C</option>
      </select>
      <textarea
        style={textareaStyle}
        value={code}
        onChange={handleCodeChange}
      />
      <button style={buttonStyle} onClick={handleRunCode}>
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
