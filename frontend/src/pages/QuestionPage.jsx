import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { useAuth } from "../AuthContext";
import withAuth from "../hoc/withAuth"; 
import AddQuestionButton from "../components/question/AddQuestionButton";
import AddQuestionForm from "../components/question/AddQuestionForm";
import Dialog from "../components/question/Dialog";
import EditQuestionForm from "../components/question/EditQuestionForm";
import QuestionDetail from "../components/question/QuestionDetail";
import QuestionTable from "../components/question/QuestionTable";
import "../components/question/DialogForm.css";

const QuestionPage = () => {
  const { accessToken } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate
  const [questions, setQuestions] = useState([]);
  const [dialogForm, setDialogForm] = useState(null);
  const dialogRef = useRef(null);

  const getHeaders = () => {
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    };
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:8080/questions", {
          method: "GET",
          headers: getHeaders()
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }

    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  // Add questions
  const handleAddQuestion = async (newQuestion) => {

    try {
      const response = await fetch("http://localhost:8080/questions", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newQuestion),
      });

      if (response.ok) {
        const savedQuestion = await response.json();
        console.log("savedQuestion:", savedQuestion);
        setQuestions((prevQuestions) => [...prevQuestions, savedQuestion]);
        toggleDialog();
      } else {
        console.error("Failed to add question");
        var responseMessage = await response.json()
        const errorWindow = window.alert(
          responseMessage.message
        );
      }
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleCloseDetail = () => {
    setDialogForm(null);
    toggleDialog();
  };

  // View question
  const handleViewQuestion = async (question) => {
    setDialogForm(
      <QuestionDetail question={question} onClose={handleCloseDetail} />
    );
    toggleDialog();
  };

  // Edit question
  const handleEditQuestion = async (question) => {
    setDialogForm(
      <EditQuestionForm question={question} onUpdate={handleUpdateQuestion} />
    );
    toggleDialog();
  };

  const handleUpdateQuestion = async (updatedQuestion) => {
    try {
      const response = await fetch(
        `http://localhost:8080/questions/${updatedQuestion._id}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(updatedQuestion),
        }
      );

      if (response.ok) {
        const savedQuestion = await response.json();
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q._id === savedQuestion._id ? savedQuestion : q
          )
        );
        toggleDialog();
      } else {
        console.error(
          `Failed to edit question: ${response.status} ${response.statusText}`
        );
        var responseMessage = await response.json()
        const errorWindow = window.alert(
          responseMessage.message
        );
      }
    } catch (error) {
      console.error("Error editing question:", error);
    }
  };

  // Delete question
  const handleDeleteQuestion = async (deletedQuestion) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${deletedQuestion.title}"?`
    );

    if (!confirmDelete) {
      return; // Exit if the user cancels
    }

    try {
      const response = await fetch(
        `http://localhost:8080/questions/${deletedQuestion._id}`,
        {
          method: "DELETE",
          headers: getHeaders(),
          body: JSON.stringify(deletedQuestion),
        }
      );

      if (response.ok) {
        const updatedQuestionList = await response.json();
        setQuestions(updatedQuestionList);
        console.log("Question deleted successfully!");
      } else {
        const errorMessage = await response.text();
        console.error(
          `Failed to delete question: ${response.status} ${errorMessage}`
        );
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };



  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div style={{ paddingTop: "70px", position: "relative" }}>
      <h1 style={{ visibility: "hidden" }}>Question Page</h1>
      <button
        style={{
          position: "absolute",
          top: "40px",
          left: "35px", 
        }}
        className="button-custom" // using the AddQuestionButton.js 
        onClick={handleBack}
      >
        <i className="fas fa-arrow-left"></i> Back
      </button>
      <AddQuestionButton
        onClick={() => {
          setDialogForm(<AddQuestionForm onAdd={handleAddQuestion} />);
          toggleDialog();
        }}
      />
      <QuestionTable
        questions={questions}
        onEdit={handleEditQuestion}
        onView={handleViewQuestion}
        onDelete={handleDeleteQuestion}
      />
      <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
        {dialogForm}
      </Dialog>
    </div>
  );


};

const WrappedQuestionPage = withAuth(QuestionPage);
export default WrappedQuestionPage;