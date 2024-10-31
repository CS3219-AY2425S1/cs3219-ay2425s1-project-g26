import React from 'react';

const TestResultTab = ({ params, input, output, expected }) => {

  return (
    <div>
      <h4>{params} =</h4>
      {input}
      <h4>output = </h4>
      {output}
      <h4>expected = </h4>
      {expected}
    </div>
  );
};

export default TestResultTab;
