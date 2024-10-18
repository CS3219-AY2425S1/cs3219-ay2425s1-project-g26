import React, { useState } from "react";

const AddQuestionForm = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [complexity, setComplexity] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState("");

  const validComplexities = ["Easy", "Medium", "Hard"];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validComplexities.includes(complexity)) {
      setError("Complexity must be one of: Easy, Medium, Hard");
      return;
    }

    setError("");
    onAdd({ title, description, category, complexity });

    setTitle("");
    setDescription("");
    setCategory("");
    setComplexity("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "700px",
        height: "700px",
        margin: "0 auto",
        padding: "20px",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
        fontFamily: "'Figtree', sans-serif",
      }}
    >
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontSize: "20px" }}>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontFamily: "'Figtree', sans-serif", 
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontSize: "20px" }}>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{
              width: "100%",
              height: "200px",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontFamily: "'Figtree', sans-serif",
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontSize: "20px" }}>
          Category:
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontFamily: "'Figtree', sans-serif", 
            }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontSize: "20px" }}>
          Complexity:
        </label>
        <div className="complexity-group" style={{ marginTop: "24px" }}>
          {validComplexities.map((comp) => (
            <div key={comp} style={{ marginRight: "10px" }}>
              <input
                type="radio"
                id={`complexity-${comp}`}
                value={comp}
                checked={complexity === comp}
                onChange={(e) => setComplexity(e.target.value)}
                required
                style={{ marginRight: "2px", transform: "scale(0.9)" }} 
              />
              <label
                className="radio-label"
                htmlFor={`complexity-${comp}`}
                style={{ fontSize: "14px", margin: 0 }} 
              >
                {comp}
              </label>
            </div>
          ))}
        </div>
        {error && <div style={{ color: "red", fontSize: "12px", marginTop: "16px" }}>{error}</div>}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button
          type="submit"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            padding: "12px 15px",
            backgroundColor: isHovered ? '#2a4b5e' : '#1a3042',
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "18px",
            lineHeight: "1.5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            fontFamily: "'Figtree', sans-serif", 
          }}
        >
          Add Question
        </button>
      </div>
    </form>
  );
};

export default AddQuestionForm;
