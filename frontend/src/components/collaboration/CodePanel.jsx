import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { Toaster, toast } from 'sonner';
import { basicSetup } from 'codemirror';
import TestCases from './TestCases';

const socket = io('http://localhost:8084');

const CodePanel = ({ question, sessionId }) => {
  const testcase = question.testcase;
  const isTestcaseAvailable = question.testcase.isAvailable;
  let defaultCodes;

  if (isTestcaseAvailable) {
    defaultCodes = {
      javascript: `// JavaScript code
const example = "raesa";
console.log(example);`,
  
      python: `# Python code
def solution(${testcase.python.params}):
    return ""
    `,

      java: `// Java code
class Solution {
  public static ${testcase.java.return_type} solution(${testcase.java.params}) {

  }
}`};
  } else {
    defaultCodes = {
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
}`
    };
  }


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
    ).then(response => response.json())
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
        body: JSON.stringify(updateData)
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


    socket.on('codeUpdate', data => {
      if (language == data.language) {
        setCode(data.code)
      }
    });

    socket.on('languageUpdate', (newLanguage, newCode) => {
      setLanguage(newLanguage);
      setCode(newCode);
      setOutput('');
    });

    socket.on('partnerLeft', () => {
      toast.info('Your partner has ended the session.');
      localStorage.setItem('partnerLeft', true);
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
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [code]);

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    handleLoadCode(selectedLanguage, sessionId);

    // Re-register event
    socket.off('codeUpdate');
    socket.on('codeUpdate', data => {
      if (selectedLanguage == data.language) {
        setCode(data.code)
      }
    });
    setOutput('');
    /*  Swapping language on one side should not change it on another
    if (socket) {
      socket.emit('languageChange', sessionId, selectedLanguage, newCode);
    } */
  };

  const handleCodeChange = (value) => {
    setCode(value);
    if (socket) {
      socket.emit('codeChange', sessionId, value, language);
    }
  };

  const handleResetCode = async () => {
    const newCode = defaultCodes[language];
    handleCodeChange(newCode);
  }

  const handleRunCode = async () => {
    setOutput('');
    setIsButtonDisabled(true);

    const requestBody = {
      code,
      language,     
      testcase 
    }; 

    try {
      const response = await fetch('http://localhost:8083/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();

      if (!response.ok) { // if http status >= 400
        setOutput(`Error: ${result.error || 'Unknown error'}\nDetails: ${result.details || 'No additional details'}`);
        return; 
      }

      setOutput(result.output);

      //result.result returns a boolean array: [true, true] or [true, false]
      console.log(result.output);
      console.log(result.result);

      // Update past attempt data
      const dataUpdate = {
        newAttempt: {
          language: language,
          content: code,
          testCases: result.result
        }
      }
      const update = handleUpdateSessionData(sessionId, dataUpdate);

      return result;
      
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setTimeout(() => setIsButtonDisabled(false), 2000);
    }
  };

  const handleSubmitCode = async () => {
    try {
      console.log("HI");
      const result = await handleRunCode();
      console.log(result.result);
      
      //TODO: Send post req to past attempt svc once it's ready.
      
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
    <div style={{ 
      backgroundColor: '#fff', 
      padding: '20px', 
      borderRadius: '8px', 
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
      height: '100%', 
      position: 'relative', 
      overflow: 'hidden'
    }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a3042' }}>Code</h2>
      <select style={{ 
        position: 'absolute', 
        top: '10px', 
        right: '20px', 
        padding: '5px', 
        fontSize: '1rem', 
        fontFamily: 'monospace' 
      }} value={language} onChange={handleLanguageChange}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>
      <div style={{ height: '400px', overflow: 'hidden', position: 'relative' }}>

      <CodeMirror
        value={code}
        height="400px"
        extensions={[languageExtensions[language]]}
        onChange={handleCodeChange}
        style={{ 
          height: '100%', 
          overflowY: 'auto',
          overflowX: 'hidden',
          whiteSpace: 'pre-wrap'
        }} 
      />
      </div>
      <div style={{ marginTop: '20px', marginRight: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
      <button
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#ccc',
          color: 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
        }}
        onClick={handleResetCode}
        disabled={isButtonDisabled}
      >
        Reset Answer
      </button>

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
      </div>
      
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
        onClick={handleSubmitCode}
        disabled={isButtonDisabled}
      >
        Finalise Submission
      </button> 
      </div>
      <div style={{ 
        marginTop: '20px', 
        padding: '10px', 
        backgroundColor: isTestcaseAvailable ? 'transparent' : '#f0f0f0',
        borderRadius: '4px', 
        fontFamily: isTestcaseAvailable ? '' : 'monospace', 
        fontSize: '1rem', 
        whiteSpace: 'pre', 
        border: isTestcaseAvailable ? 'none' : '1px solid #ddd',
        maxHeight: isTestcaseAvailable ? '' : '150px',
        overflowY: 'auto', 
        overflowX: 'auto' 
      }}>
        {isTestcaseAvailable ? (
          <TestCases testCases={testcase.python} />
        ) : (
          <>
            <h3>Output:</h3>
            <pre>{output}</pre>
          </>
        )}
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default CodePanel;
