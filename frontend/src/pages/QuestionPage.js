// src/pages/QuestionPage.js
import React, { useState, useEffect } from "react";
import QuestionTable from "../components/QuestionTable";
import AddQuestionForm from "../components/AddQuestionForm";
import EditQuestionForm from "../components/EditQuestionForm";

const QuestionPage = () => {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null); // State for the question being edited

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:8080/questions'); // Replace with your backend URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setQuestions(data); // Update the state with fetched questions
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions(); // Call the fetch function on component mount
  }, []); // Empty dependency array to run only once


  const handleAddQuestion = async (newQuestion) => {
    // Here, you can send the new question to your backend
    try {
      const response = await fetch('http://localhost:8080/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestion),
      });

      if (response.ok) {
        const savedQuestion = await response.json();
        setQuestions((prevQuestions) => [...prevQuestions, savedQuestion]);
      } else {
        console.error('Failed to add question');
      }
    } catch (error) {
      console.error('Error adding question:', error);
    }
  };

  const handleDeleteQuestion = async (id) => {
      try {
        const response = await fetch(`http://localhost:8080/questions/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setQuestions((prevQuestions) => prevQuestions.filter(q => q._id !== id));
        } else {
          const errorMessage = await response.text(); // Get error message from response
          console.error(`Failed to delete question: ${response.status} ${errorMessage}`);
        }
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    };

    const handleEditClick = (question) => {
        setEditingQuestion(question); // Set the question to edit
      };

    const handleUpdateQuestion = async (updatedQuestion) => {
          try {
            const response = await fetch(`http://localhost:8080/questions/${updatedQuestion._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedQuestion), // Send the updated question data
            });

            if (response.ok) {
              const responseBody = await response.text(); // Get the response body as text
              if (responseBody) {
                  console.log('Response body:', responseBody); // Log the response body
                  const savedQuestion = JSON.parse(responseBody); // Parse it to JSON
    //              const savedQuestion = await response.json(); // Assuming the server returns the updated question
                  setQuestions((prevQuestions) =>
                    prevQuestions.map((q) => (q._id === savedQuestion._id ? savedQuestion : q)) // Update the specific question
                        );
                  setEditingQuestion(null); // Close the edit form
              } else {
                console.error('Received an empty response');
              }

            } else {
              const errorMessage = await response.text(); // Get error message from response
              console.error(`Failed to edit question: ${response.status} ${errorMessage}`);
            }
          } catch (error) {
            console.error('Error editing question:', error);
          }
        };

  return (
    <div style={{ paddingTop: "100px" }}>
      <h1>Questions</h1>
      <AddQuestionForm onAdd={handleAddQuestion} />
      {editingQuestion && (
              <EditQuestionForm question={editingQuestion} onUpdate={handleUpdateQuestion} />
            )}
      <QuestionTable questions={questions} onDeleteQuestion={handleDeleteQuestion} onEdit={handleEditClick} />
    </div>
  );
};

export default QuestionPage;
