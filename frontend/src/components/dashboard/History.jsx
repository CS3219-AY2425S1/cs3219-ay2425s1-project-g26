import React from "react";

const History = ({ history, onView }) => {
    if (!history || history.length === 0) {
        return <p>No attempt history found.</p>;
    }
    const display = history.slice(0, 10);

    return (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
            <tr>
            <th style={{ border: "1px solid #ddd", padding: "4px" }}>Question</th>
            <th style={{ border: "1px solid #ddd", padding: "4px" }}>Category</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Difficulty</th>
            <th style={{ border: "1px solid #ddd", padding: "4px" }}>Attempted On</th>
            <th style={{ border: "1px solid #ddd", padding: "4px" }}>Time Taken</th>
            <th style={{ border: "1px solid #ddd", padding: "4px" }}>Details</th>
            </tr>
        </thead>
        <tbody>
            {display.map((attempt) => (
            <tr key={attempt.id}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}> {attempt.question.title} </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}> {attempt.question.category.toString()} </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}> {attempt.question.complexity} </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}> {attempt.startDateTime} </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}> {attempt.timeTaken} </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}> <button onClick={() => onView(attempt)}>View</button> </td>
                
            </tr>
            )).reverse().slice(0, 5)}
        </tbody>
        </table>
    );
};

export default History;