import React from 'react';

const TestResultTab = ({ params, input, output, expected, result, hasError }) => {
  return (
    <div className='result-container'>
      {hasError ? (
        <p className="error-text">Error</p>
      ) : (
        <p className={result ? "accepted-text" : "wrong-text"}>
          {result ? "Accepted" : "Wrong Answer"} 
        </p>
      )}
      <pre className='case-key'>{params} =</pre>
      <pre className='case-value'>{input}</pre>
      <pre className='case-key'>output =</pre>
      <pre className={`case-value ${hasError ? 'output-error' : ''}`}>{output}</pre>
      <pre className='case-key'>expected =</pre>
      <pre className='case-value'>{expected}</pre>
    </div>
  );
};

export default TestResultTab;
