import React, { useState } from 'react';
import TestCasesTabs from './TestCasesTabs';
import TestResultsTabs from './TestResultsTabs';
import './styles/testcases.css'; 

const TestCases = ({ testCases, output, results, hasError, activeTab, setActiveTab }) => {
  return (
    <div className='test-case-container'>
      <div className='test-headers'>
        <div 
          className={`test-tab ${activeTab === 0 ? 'active-tab' : ''}`} 
          onClick={() => setActiveTab(0)}
        >
          Test Cases
        </div>
        <div 
          className={`test-tab ${activeTab === 1 ? 'active-tab' : ''}`} 
          onClick={() => setActiveTab(1)}
        >
          Test Results
        </div>
      </div>
      <div className='cases-container'>
        {activeTab === 0 ? (
          <TestCasesTabs testCases={testCases} />
        ) : (
          <TestResultsTabs
            testCases={testCases}
            output={output}
            results={results}
            hasError={hasError}
          />
        )}
      </div>
    </div>
  );
};

export default TestCases;