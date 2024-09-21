// src/components/AddQuestionForm.js
import React, { useState } from "react";

const AddQuestionForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [complexity, setComplexity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ title, description, category, complexity });

    // Clear the form
    setTitle('');
    setDescription('');
    setCategory('');
    setComplexity('');
  };

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
      <button type="submit">Add Question</button>
    </form>
  );
};

export default AddQuestionForm;
