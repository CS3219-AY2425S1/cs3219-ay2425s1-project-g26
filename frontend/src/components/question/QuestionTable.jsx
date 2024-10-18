// src/components/QuestionTable.js
import React, { useState } from "react";
import "./QuestionTable.css"; // Import the CSS file

const complexityOrder = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

const QuestionTable = ({ questions, onEdit, onView, onDelete }) => {
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedQuestions = [...questions].sort((a, b) =>
    a.title.localeCompare(b.title)
  );

  const sortByComplexity = () => {
    const orderMultiplier = sortOrder === "asc" ? 1 : -1;

    return sortedQuestions.sort((a, b) => {
      return (
        (complexityOrder[a.complexity] - complexityOrder[b.complexity]) *
        orderMultiplier
      );
    });
  };

  const handleSortClick = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const displayedQuestions = sortByComplexity();

  return (
    <div className="table-wrapper">
      <h1></h1>
      <table className="table-custom">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>
              Complexity
              <button className="sort-button" onClick={handleSortClick}>
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedQuestions.map((question) => (
            <tr key={question._id}>
              <td>{question.title}</td>
              <td>{question.category.join(', ')}</td>
              <td>{question.complexity}</td>
              <td>
                <button onClick={() => onEdit(question)}>Edit</button>
                <button onClick={() => onView(question)}>View</button>
                <button onClick={() => onDelete(question)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionTable;
