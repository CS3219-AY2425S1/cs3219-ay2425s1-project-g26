import React from 'react';
import "./styles/question.css";

const Question = ({ question }) => {
  return (
    <div className='question-tab'>
      <h3>{question.title}</h3>
      <div className="tags">
        <div className="complexity">{question.complexity}</div>
        {
          question.category.map((cat) => (
            <div className="category">{cat}</div>
          ))
        }
      </div>
      <p>{question.description}</p>
    </div>
  );
};

export default Question;
