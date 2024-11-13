import React from 'react';

const TestCaseTab = ({ params, input, expected }) => {
  return (
    <div>
      <pre className='case-key'>{params} =</pre>
      <pre className='case-value'>{input}</pre>
      <pre className='case-key'>Expected =</pre>
      <pre className='case-value'>{expected}</pre>
    </div>
  );
};

export default TestCaseTab;