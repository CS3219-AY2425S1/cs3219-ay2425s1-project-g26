//src/components/AddQuestionButton.js
import React from 'react';

const AddQuestionButton = ({ onClick }) => {
  return (
    <button
      style={{
        position: "absolute", 
        top: "30px",
        right: "35px", 
      }}
      className="button-custom"
      onClick={onClick}
    >
      Add Question
    </button>
  );
};

export default AddQuestionButton;
