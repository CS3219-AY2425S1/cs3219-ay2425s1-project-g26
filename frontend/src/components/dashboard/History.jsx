import React, { useEffect, useState } from "react";

const History = ({ history, onView }) => {
    const [searchInput, setSearchInput] = useState("");

    const defaultDisplay = history && history.length > 0 ? history.toReversed().slice(0, 10) : [];
    const [displayedHistory, setDisplayedHistory] = useState(defaultDisplay);

    const handleFilterInput = (filterString) => {
        if (filterString) {
            const totalString = filterString.toLowerCase();
            const splits = totalString.split(",")
            console.log(splits)
            let display = history.filter((entry) => {
                for (let split of splits) {
                    let filterInput = split.trim();
                    let questionTitleCheck = entry.question.title.toLowerCase().includes(filterInput);
                    let questionComplexityCheck = entry.question.complexity.toLowerCase().includes(filterInput);
                    let questionCategoryCheck = entry.question.category.filter((category) => category.toLowerCase().includes(filterInput)).length > 0;
                    let questionCheck = questionTitleCheck || questionComplexityCheck || questionCategoryCheck;

                    let partnerCheck = entry.partner.toLowerCase().includes(filterInput);

                    let dateTimeCheck = entry.startDateTime.toLowerCase().includes(filterInput);

                    let completionCheck = entry.completion.toLowerCase().includes(filterInput);
                    let timeTakenCheck = entry.timeTaken.toLowerCase().includes(filterInput);

                    let attemptLanguageCheck = entry.attempt.language.toLowerCase().includes(filterInput);
                    let attemptContentCheck = entry.attempt.content.toLowerCase().includes(filterInput);
                    let attemptCheck = attemptLanguageCheck || attemptContentCheck;

                    let checkGroups1 = partnerCheck || dateTimeCheck || completionCheck || timeTakenCheck;
                    console.log(partnerCheck);
                    console.log(dateTimeCheck);
                    console.log(completionCheck);
                    console.log(`timeTakenCheck ${timeTakenCheck}, ${filterInput}, ${entry.timeTaken.toLowerCase()}`);
                    if (!(checkGroups1 || questionCheck || attemptCheck)) {
                        return false;
                    }
                }
                return true;
            });

            setDisplayedHistory(display.toReversed());
        } else {
            setDisplayedHistory(defaultDisplay);
        }
    }

    useEffect(() => {
        handleFilterInput(searchInput)
    }, [searchInput])

    useEffect(() => {
        if (Array.isArray(history)) {
            setDisplayedHistory(defaultDisplay);  // Reset to full history when 'history' prop changes
        }
    }, [history]);
    
    return (
        <div style={{
            width: "100%",
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            fontFamily: "Figtree",
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ textAlign: "center", fontSize: "20px", color: "#000", marginLeft: "5px", marginBottom: "20px" }}>
                    Attempt History
                </h2>
                <input
                    style={{
                        padding: "8px 12px",
                        fontSize: "16px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        outline: "none",
                        marginBottom: "20px",
                        transition: "border-color 0.3s, box-shadow 0.3s",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                    }}
                    type='text'
                    placeholder="Filter"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onFocus={(e) => {
                        e.target.style.borderColor = "#3498db";
                        e.target.style.boxShadow = "0 0 6px rgba(52, 152, 219, 0.3)";
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = "#ccc";
                        e.target.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
                    }}
                />
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
                        {displayedHistory.length > 0 ? (
                            displayedHistory.map((attempt) => (
                                <tr key={attempt.id} style={{
                                    borderBottom: "1px solid #ddd",
                                    backgroundColor: "#f9f9f9",
                                    transition: "background-color 0.3s",
                                }}>
                                    <td style={{ padding: "12px", color: "#333" }}>{attempt.question.title}</td>
                                    <td style={{ padding: "12px", color: "#333" }}>
                                        {Array.isArray(attempt.question.category) 
                                            ? attempt.question.category.join(", ") 
                                            : attempt.question.category.toString()}
                                        </td>
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
