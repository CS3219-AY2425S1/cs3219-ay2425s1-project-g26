import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { Toaster, toast } from 'sonner';

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

  const handleLoadCode = async (language, sessionId) => {

    const session = await fetch(
      `http://localhost:8084/sessions/${sessionId}`, 
      {
        method: "GET",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
         },
      }
    )
    .then((data) => {
      console.log(data);
      if (language === 'python') {
        setCode(data.codeWindows.python);
      } else if (language === 'java') {
        setCode(data.codeWindows.java);
      } else if (language === 'javascript') {
        setCode(data.codeWindows.javascript);
      }
    });
  }

  const handleUpdateSessionData = async (sessionId, data) => {
    const updateData = {
      sessionid: sessionId
    }

    if (data.newAttempt) {
      updateData.newAttempt = data.newAttempt;
    }
    if (data.language && data.code) {
      updateData.language = data.language;
      updateData.code = data.code;
    }

    console.log(updateData);
    const response = await fetch(
      `http://localhost:8084/sessions/${sessionId}`, 
      {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: updateData
      });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    handleLoadCode('python', sessionId);
  }, []);

  useEffect(() => {
    socket.emit('join', sessionId);


    socket.on('codeUpdate', (newCode) => {
      setCode(newCode);
    });

    socket.on('languageUpdate', (newLanguage, newCode) => {
      setLanguage(newLanguage);
      setCode(newCode);
      setOutput('');
    });

    socket.on('partnerLeft', () => {
      toast.info('Your partner has ended the session.');
    });

    return () => {
      socket.off('codeUpdate');
      socket.off('languageUpdate');
      socket.off('partnerLeft');
    };
  }, [sessionId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const data = {
        language: language,
        code: code
      }
      handleUpdateSessionData(sessionId, data);
    }, 3000);

    return () => {
      clearTimeout(handler);
    };
  }, [code]);

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    const newCode = handleLoadCode(selectedLanguage, sessionId);
    setLanguage(selectedLanguage);
    setCode(newCode);
    setOutput('');
    /*  Swapping language on one side should not change it on another
    if (socket) {
      socket.emit('languageChange', sessionId, selectedLanguage, newCode);
    } */
  };

  const handleCodeChange = (value) => {
    setCode(value);
    if (socket) {
      socket.emit('codeChange', sessionId, value);
    }
  };

  const handleRunCode = async () => {
    setOutput('');
    setIsButtonDisabled(true);

    const requestBody = {
      code,
      language,
    };

    try {
      const response = await fetch('http://localhost:8083/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const dataUpdate = {
        newAttempt: {
          language: language,
          content: code,
          testCases: [] //Insert Test Case Implementation here.
        }
      }
      const update = handleUpdateSessionData(sessionId, dataUpdate);
      const result = await response.json();

      if (!response.ok) { // if http status >= 400
        setOutput(`Error: ${result.error || 'Unknown error'}\nDetails: ${result.details || 'No additional details'}`);
        return; 
      }

      setOutput(result.output);
      
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setTimeout(() => setIsButtonDisabled(false), 2000);
    }
  };

  const languageExtensions = {
    javascript: javascript(),
    python: python(),
    java: java(),
  };

  return (
    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', height: '100%', position: 'relative' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a3042' }}>Code</h2>
      <select style={{ position: 'absolute', top: '10px', right: '20px', padding: '5px', fontSize: '1rem', fontFamily: 'monospace' }} value={language} onChange={handleLanguageChange}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>
      <CodeMirror
        value={code}
        height="400px"
        extensions={[languageExtensions[language]]}
        onChange={handleCodeChange}
      />
      <button
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: isButtonDisabled ? '#ccc' : '#1a3042',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
        }}
        onClick={handleRunCode}
        disabled={isButtonDisabled}
      >
        Run Code
      </button>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px', fontFamily: 'monospace', fontSize: '1rem', whiteSpace: 'pre', border: '1px solid #ddd', maxHeight: '200px', overflowY: 'auto', overflowX: 'auto' }}>
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default CodePanel;
