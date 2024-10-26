import React from "react";
import { AuthProvider } from './AuthContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import QuestionPage from "./pages/QuestionPage";
import DashboardPage from "./pages/DashboardPage";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NewSessionPage from "./pages/NewSessionPage";
import WaitingPage from "./pages/WaitingPage";
import ManageProfilePage from "./pages/ManageProfilePage";
import ConfirmTokenPage from "./pages/ConfirmTokenPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CollaborationPage from "./pages/CollaborationPage"; 
import SummaryPage from "./pages/SummaryPage";
import backgroundImage from "./assets/images/darker.jpg"; 
import "./styles/App.css"; 

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
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/questions" element={<QuestionPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forget-password" element={<ForgetPasswordPage />} />
            <Route path="/new-session" element={<NewSessionPage />} />
            <Route path="/waiting" element={<WaitingPage />} />
            <Route path="/manage-profile" element={<ManageProfilePage />} />
            <Route path="/confirm-token" element={<ConfirmTokenPage />} /> 
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/collaboration" element={<CollaborationPage />} />
            <Route path="/summary" element={<SummaryPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
