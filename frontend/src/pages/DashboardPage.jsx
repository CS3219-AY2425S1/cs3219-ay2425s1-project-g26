import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Calendar from "../components/dashboard/Calendar"; 
import SessionBox from "../components/dashboard/SessionBox"; 
import ConfirmationModal from "../components/dashboard/ConfirmationModal"; 
import withAuth from "../hoc/withAuth"; 
import { useAuth } from "../AuthContext"; 
const DashboardPage = () => {
  const navigate = useNavigate(); 
  const { logout } = useAuth(); // Get the logout function from AuthContext
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const hasActiveSession = false; 

  const handleLogout = () => {
    logout(); // Use the logout function from AuthContext
    navigate('/login'); // Redirect to login after logout
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = (confirm) => {
    if (confirm) {
      handleLogout();
    }
    setShowLogoutConfirm(false); 
  };

  return (
    <div style={{ paddingTop: "100px", display: "flex", justifyContent: "center", position: 'relative' }}>
      <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: "20px", 
          maxWidth: "600px", 
          marginRight: "20px" 
        }}>
        
        {/* Current Active Session Component */}
        <SessionBox
          headerText="Current Active Session"
          sessionText={hasActiveSession ? "Current active session with ____" : "No active session. Ready for more?"}
          buttonText={hasActiveSession ? "Rejoin Session" : "New Question"}
          buttonLink={hasActiveSession ? "/rejoin" : "/new-question"}
        />

        {/* Go to Question Page Box */}
        <SessionBox
          headerText="Go to Question Page"
          sessionText="Navigate to the question page to view, add, edit or delete questions."
          buttonText="Manage Questions"
          buttonLink="/questions"
        />
      </div>

      {/* right: calendar */}
      <div style={{ marginLeft: "20px" }}>  
        <Calendar
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
        />
      </div>

      {/* Logout Button  */}
      <div style={{ position: 'absolute', top: '30px', right: '30px' }}>
        <button
          onClick={confirmLogout}
          style={{
            padding: "15px 30px", 
            backgroundColor: "#fff", 
            color: "#000",
            border: "none",
            borderRadius: "15px",
            cursor: "pointer",
            fontSize: '16px',
            fontFamily: 'Figtree',
          }}
        >
          Logout
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal 
        show={showLogoutConfirm} 
        onConfirm={() => handleConfirmLogout(true)} 
        onCancel={() => handleConfirmLogout(false)} 
      />
    </div>
  );
};

const WrappedDashboardPage = withAuth(DashboardPage);
export default WrappedDashboardPage;
