/* eslint-disable react/prop-types */
import { useState } from "react";

const QuestionDetail = ({ question, onClose }) => {
  const [isHovered, setIsHovered] = useState(false); // State for hover

  return (
    <div
      style={{
        width: "700px", // Fixed width
        maxHeight: "700px", // Max height to ensure scrolling
        padding: "20px",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        overflowY: "auto", // Scrollable content if it exceeds the max height
        position: "relative",
        fontFamily: "'Figtree', sans-serif", // Set font family to Figtree
        color: "#444", // Base text color
      }}
    >
      <h1 style={{ fontSize: "24px", marginBottom: "10px", color: "#333" }}>
        {question.title}
      </h1>
      <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
        Category:{" "}
        <span style={{ fontWeight: "normal" }}>{question.category.join(', ')}</span>
      </p>
      <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
        Complexity:{" "}
        <span style={{ fontWeight: "normal" }}>{question.complexity}</span>
      </p>
      <h2 style={{ fontSize: "20px", marginTop: "20px", color: "#666" }}>
        Description:
      </h2>
      <p style={{ lineHeight: "1.6", color: "#444", whiteSpace: "pre-wrap", marginBottom: "60px" }}>
        {question.description}
      </p>

      {/* Button container */}
      <div
        style={{
          position: "sticky", // Sticky positioning
          bottom: "20px", // 20px from the bottom
          left: "0", // Align to the left
          backgroundColor: "#fff", // Match background color
          padding: "0 20px", // Optional padding to align with the container
          zIndex: "1", // Ensure it stays above content
        }}
      >
        <button
          onClick={onClose}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            padding: "12px 15px",
            backgroundColor: isHovered ? "#2a4b5e" : "#1a3042", // Match button colors to forms
            color: "#fff", // Button text color
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            lineHeight: "1.5",
            display: "block",
            width: "100%",
            fontFamily: "'Figtree', sans-serif", // Ensure button text also uses Figtree
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default QuestionDetail;
