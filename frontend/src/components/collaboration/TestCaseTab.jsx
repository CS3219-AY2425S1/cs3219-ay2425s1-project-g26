import React from 'react';

const TestCaseTab = ({ params, input }) => {
  return (
    <div>
      <pre className='case-key'>{params} =</pre>
      <pre className='case-value'>{input}</pre>
    </div>
  );
};

export default TestCaseTab;