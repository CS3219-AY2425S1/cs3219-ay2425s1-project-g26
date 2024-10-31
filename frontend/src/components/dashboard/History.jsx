import React from "react";

const History = ({ history, onView }) => {
    const display = history && history.length > 0 ? history.slice(0, 10) : [];

    return (
        <div style={{
            width: "100%",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            fontFamily: "Figtree",
        }}>
            <div>
                <h2 style={{ textAlign: "center", fontSize: "20px", color: "#333", marginBottom: "20px" }}>Attempt History</h2>
            </div>
            <div style={{
                maxHeight: "300px",
                overflowY: "auto",
            }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            {["Question", "Category", "Difficulty", "Attempted On", "Time Taken", "Completion", "Details"].map((header) => (
                                <th key={header} style={{
                                    padding: "12px",
                                    backgroundColor: "#1a3042",
                                    color: "#fff",
                                    borderBottom: "1px solid #ddd",
                                    fontWeight: "600",
                                    textAlign: "left",
                                }}>
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {display.length > 0 ? (
                            display.map((attempt) => (
                                <tr key={attempt.id} style={{
                                    borderBottom: "1px solid #ddd",
                                    backgroundColor: "#f9f9f9",
                                    transition: "background-color 0.3s",
                                }}>
                                    <td style={{ padding: "12px", color: "#333" }}>{attempt.question.title}</td>
                                    <td style={{ padding: "12px", color: "#333" }}>{attempt.question.category.toString()}</td>
                                    <td style={{ padding: "12px", color: "#333" }}>{attempt.question.complexity}</td>
                                    <td style={{ padding: "12px", color: "#333" }}>{attempt.startDateTime}</td>
                                    <td style={{ padding: "12px", color: "#333" }}>{attempt.timeTaken}</td>
                                    <td style={{ padding: "12px", color: "#333" }}>{attempt.completion}</td>
                                    <td style={{ padding: "12px" }}>
                                        <button 
                                            onClick={() => onView(attempt)}
                                            style={{
                                                padding: "8px 16px",
                                                backgroundColor: "#1a3042",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                fontSize: "14px",
                                                fontFamily: "Figtree",
                                                transition: "background-color 0.3s",
                                            }}
                                            onMouseEnter={(e) => e.target.style.backgroundColor = "#2a4b5e"}
                                            onMouseLeave={(e) => e.target.style.backgroundColor = "#1a3042"}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr style={{
                                borderBottom: "1px solid #ddd",
                                backgroundColor: "#f9f9f9",
                                textAlign: "center"
                            }}>
                                <td colSpan="7" style={{ padding: "12px", color: "#333" }}>No attempt history found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default History;
