import React, { useState } from 'react';
import TestCaseTab from './TestCaseTab';

const TestCasesTabs = ({ testCases }) => {
  const [activeTab, setActiveTab] = useState(0);
  const params = testCases.params;
  const inputs = testCases.input;
  // const expected = testCases.output;
  
  return (
    <div>
      <div style={{ display: 'flex', cursor: 'pointer', gap: '1rem' }}>
        {inputs.map((_, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(index)}
          >
            Case {index + 1}
          </div>
        ))}
      </div>
      <TestCaseTab params={params} input={inputs[activeTab]} />
    </div>
  );
};

export default TestCasesTabs;
