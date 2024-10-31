import React from 'react';

const TestResultTab = ({ params, input, output, expected, result }) => {
  return (
    <div>
      <p>{result ? "Accepted" : "Wrong Answer"}</p>
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
