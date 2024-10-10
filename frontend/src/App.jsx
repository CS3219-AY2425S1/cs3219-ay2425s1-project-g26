// src/App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import QuestionPage from "./pages/QuestionPage";
import DashboardPage from "./pages/DashboardPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import backgroundImage from "./assets/images/darker.jpg"; // path for background
import "./styles/App.css"; // css file

const App = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/questions" element={<QuestionPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
      </Routes>
    </div>
  );
};

export default App;
