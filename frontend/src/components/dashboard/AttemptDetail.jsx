/* eslint-disable react/prop-types */
import { useState } from "react";

const AttemptDetail = ({ attempt, onClose }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        width: "700px",
        maxHeight: "700px",
        padding: "20px",
        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        overflowY: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Figtree', sans-serif",
        color: "#444",
      }}
    >
      <div style={{ overflowY: "auto", flex: "1" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "10px", color: "#333" }}>
          {attempt.question.title}
        </h1>
        <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
          Category:{" "}
          <span style={{ fontWeight: "normal" }}>{attempt.question.category.join(', ')}</span>
        </p>
        <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
          Complexity:{" "}
          <span style={{ fontWeight: "normal" }}>{attempt.question.complexity}</span>
        </p>
        <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
          Attempted on:{" "}
          <span style={{ fontWeight: "normal" }}>{attempt.startDateTime}</span>
        </p>
        <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
          Time taken:{" "}
          <span style={{ fontWeight: "normal" }}>{attempt.timeTaken}</span>
        </p>
        <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
          Partner:{" "}
          <span style={{ fontWeight: "normal" }}>{attempt.partner}</span>
        </p>
        <h2 style={{ fontSize: "20px", marginTop: "20px", color: "#666" }}>
          Question Description:
        </h2>
        <p style={{ lineHeight: "1.6", color: "#444", whiteSpace: "pre-wrap", marginBottom: "20px" }}>
          {attempt.question.description}
        </p>
        <h2 style={{ fontSize: "20px", marginTop: "20px", color: "#666" }}>
          Final Code:
        </h2>
        <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
          Language:{" "}
          <span style={{ fontWeight: "normal" }}>{attempt.attempt.language}</span>
        </p>
        <p style={{ color: "#444", whiteSpace: "pre-wrap", background: "#eee", padding: "0.5rem", "border-radius": "4px", maxWidth: "62ch", marginBottom: "5px" }}>
          <code style={{textAlign: "left", whiteSpace: "pre", lineHeight: "1", wordSpacing: "normal" }}>{attempt.attempt.content}</code>
        </p>
        <p style={{ marginBottom: "5px", fontWeight: "bold", color: "#555" }}>
          Test Cases Passed:{" "}
          <span style={{ fontWeight: "normal" }}>{`${attempt.attempt.testCases.filter(Boolean).length}/${attempt.attempt.testCases.length}`}</span>
        </p>
      </div>

      <div
        style={{
          marginTop: "20px",
          backgroundColor: "#fff",
          zIndex: "1",
        }}
      >
        <button
          onClick={onClose}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            padding: "12px 15px",
            backgroundColor: isHovered ? "#2a4b5e" : "#1a3042",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            lineHeight: "1.5",
            display: "block",
            width: "100%",
            fontFamily: "'Figtree', sans-serif",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AttemptDetail;
