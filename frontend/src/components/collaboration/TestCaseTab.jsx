import React from 'react';

const TestCaseTab = ({ params, input }) => {
  return (
    <div>
      <h4>{params} =</h4>
      {input}
    </div>
  );
};

export default TestCaseTab;
