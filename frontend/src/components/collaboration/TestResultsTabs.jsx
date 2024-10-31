import React, { useState } from 'react';
import TestResultsTab from './TestResultTab';

const TestResultsTabs = ({ testCases, output }) => {
  const [activeTab, setActiveTab] = useState(0);
  const params = testCases.params;
  const inputs = testCases.input;
  const expected = testCases.output;

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
      <TestResultsTab params={params} input={inputs[activeTab]} output={output[activeTab]} expected={expected[activeTab]}  />
    </div>
  );
};

export default TestResultsTabs;
