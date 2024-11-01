import React, { useState } from 'react';
import TestResultsTab from './TestResultTab';

const TestResultsTabs = ({ testCases, output, results }) => {
  const [activeTab, setActiveTab] = useState(0);
  const params = testCases.params;
  const inputs = testCases.input;
  const expected = testCases.output;

  return (
    <div>
      {output === '' ? (
        <p>You must run your code first</p>
      ) : (
        <>
          <div className='cases-headers'>
            {inputs.map((_, index) => (
              <div
              className={
                `test-tab ${activeTab === index ? 'active-tab' : ''} 
                ${results[index] ? 'accepted-tab' : 'wrong-tab'}`
              } 
                key={index}
                onClick={() => setActiveTab(index)}
              >
                Case {index + 1}
              </div>
            ))}
          </div>
          <TestResultsTab
            params={params} 
            input={inputs[activeTab]} 
            output={output[activeTab]}
            expected={expected[activeTab]} 
            result={results[activeTab]} 
          />
        </>
      )}
    </div>
  );
};

export default TestResultsTabs;
