import React, { useState } from 'react';
import TestCasesTabs from './TestCasesTabs';

const TestCases = ({ testCases }) => {
    const params = testCases.params;
    const inputs = testCases.input;
    const expected = testCases.output;

    console.log(params);
    console.log(inputs);
    console.log(expected);

    return (
        <div>
            <h3>Testcase</h3>
            <TestCasesTabs testCases={testCases} />
        </div>
    );
};

export default TestCases;
