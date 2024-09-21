// src/components/EditQuestionForm.js
import React, { useState, useEffect } from "react";

const EditQuestionForm = ({ question, onUpdate }) => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [complexity, setComplexity] = useState("");

  useEffect(() => {
      if (question) {
        setTitle(question.title);
        setDescription(question.description);
        setCategory(question.category);
        setComplexity(question.complexity);
      }
    }, [question]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question._id) {
      console.error('Invalid question ID');
      return;
    }
    onUpdate({ ...question, title, description, category, complexity });
  };

  if (!question) {
    return <div>Loading...</div>; // Handle case where question is not yet available
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label>
        Category:
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </label>
      <label>
        Complexity:
        <input
          type="text"
          value={complexity}
          onChange={(e) => setComplexity(e.target.value)}
        />
      </label>
      <button type="submit">Update Question</button>
    </form>
  );
};

export default EditQuestionForm;
