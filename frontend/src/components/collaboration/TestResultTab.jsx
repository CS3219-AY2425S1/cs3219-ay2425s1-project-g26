import React from 'react';

const TestResultTab = ({ params, input, output, expected, result }) => {
  console.log('final' + output);
  return (
    <div className='result-container'>
      <p className={result ? "accepted-text" : "wrong-text"}>
        {result ? "Accepted" : "Wrong Answer"} 
      </p>
      <pre className='case-key'>{params} =</pre>
      <pre className='case-value'>{input}</pre>
      <pre className='case-key'>output =</pre>
      <pre className='case-value'>{output}</pre>
      <pre className='case-key'>expected =</pre>
      <pre className='case-value'>{expected}</pre>
    </div>
  );
};

export default TestResultTab;
