//src/components/AddQuestionButton.js
import React from 'react';

const AddQuestionButton = ({ onClick }) => {
  return (
    <button
      style={{
        position: "absolute",
        top: "25px",
        right: "35px",
        width: "170px",
        height: "50px",
        fontSize: "16px",
        padding: "10px 20px"
      }}
      className="button-custom"
      onClick={onClick}
    >
      Add Question
    </button>
  );
};

export default AddQuestionButton;
