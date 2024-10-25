/* eslint-disable react/jsx-key */
import React from 'react';
import "./styles/question.css";

const Question = ({ question }) => {
  return (
    <div className='question-tab'>
      <h3>{question.title}</h3>
      <div className="tags">
        <div className="complexity">{question.complexity}</div>
        {
          question.category.map((cat, index) => (
            <div className="category" key={index}>{cat}</div>
          ))
        }
      </div>
      <p>
        {question.description.split('\n').map((line, index) => (
          <span key={index}>
            {line}
            <br />
          </span>
        ))}
      </p>
    </div>
  );
};

export default Question;
