import React, { useState } from 'react';

const CodePanel = () => {
  const defaultCodes = {
    javascript: '// JavaScript code\nconst example = "raesa";\nconsole.log(example);',
    python: '# Python code\nexample = "raesa"\nprint(example)',
    java: '// Java code\npublic class Main {\n  public static void main(String[] args) {\n    String example = "raesa";\n    System.out.println(example);\n  }\n}',
    c: '#include <stdio.h>\n\nint main() {\n  char example[] = "raesa";\n  printf("%s\\n", example);\n  return 0;\n}',
  };

  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(defaultCodes[language]);

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    setCode(defaultCodes[selectedLanguage]);
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
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
    height: '630px', 
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
    </div>
  );
};

export default CodePanel;
