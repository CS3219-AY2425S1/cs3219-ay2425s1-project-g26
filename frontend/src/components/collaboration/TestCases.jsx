import React, { useState, useEffect } from 'react';
import TestCasesTabs from './TestCasesTabs';
import TestResultsTabs from './TestResultsTabs';

const TestCases = ({ testCases, output, results }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div style={{ display: "flex", cursor: "pointer", gap: "1rem" }}>
        <div onClick={() => setActiveTab(0)}>Test Cases</div>
        <div onClick={() => setActiveTab(1)}>Test Results</div>
      </div>
      <div>
        {activeTab === 0 ? (
          <TestCasesTabs testCases={testCases} />
        ) : (
          <TestResultsTabs
            testCases={testCases}
            output={output}
            results={results}
          />
        )}
      </div>
    </div>
  );
};

export default TestCases;
