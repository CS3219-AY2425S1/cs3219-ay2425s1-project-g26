import React, { useState } from 'react';
import TestCaseTab from './TestCaseTab';

const TestCasesTabs = ({ testCases }) => {
  const [activeTab, setActiveTab] = useState(0);
  const params = testCases.params;
  const inputs = testCases.input;

  return (
    <div style={{ paddingBottom: '20px' }}> 
      <div className='cases-headers'>
        {inputs.map((_, index) => (
          <div 
            key={index} 
            className={`test-tab ${activeTab === index ? 'active-tab' : ''}`} 
            onClick={() => setActiveTab(index)}
          >
            Case {index + 1}
          </div>
        ))}
      </div>
      <TestCaseTab params={params} input={inputs[activeTab]} />
      <div style={{ height: '70px' }} /> 
    </div>
  );
};

export default TestCasesTabs;
