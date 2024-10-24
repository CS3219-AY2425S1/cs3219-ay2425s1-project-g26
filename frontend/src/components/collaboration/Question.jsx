import React from 'react';

const Question = ({ question }) => {
  return (
    <div>
      <h3>{question.title}</h3>
      <p>{question.description}</p>
    </div>
  );
};

export default Question;
