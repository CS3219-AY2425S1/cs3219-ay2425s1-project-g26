import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/dashboard/Calendar";
import SessionBox from "../components/dashboard/SessionBox";
import ConfirmationModal from "../components/dashboard/ConfirmationModal";
import withAuth from "../hoc/withAuth";
import { useAuth } from "../AuthContext";
import DropdownMenu from "../components/dashboard/DropdownMenu";
import RandomChallenge from "../components/dashboard/RandomChallenge";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { logout, userId, accessToken } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [hasActiveSession, setHasActiveSession] = useState(false);
  const [matchedUsername, setMatchedUsername] = useState();

  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const handleLogout = () => {
    logout();
    navigate('/login');
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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/users/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data.');
        }

        const data = await response.json();
        setUsername(data.data.username);
        setHasActiveSession(data.data.isMatched);
        setMatchedUsername(data.data.matchData.matchedUserName);
        localStorage.setItem('isMatched', JSON.stringify(data.data.isMatched));
        localStorage.setItem('matchData', JSON.stringify(data.data.matchData));
      } catch (error) {
        console.error(error);
      }
    };

    if (userId && accessToken) {
      fetchUserData();
    }
  }, [userId, accessToken]);

  return (
    <div
      style={{
        paddingTop: "30px",
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "600px",
          marginRight: "20px",
        }}
      >
        <div
          style={{
            color: "#fff",
            marginBottom: "20px",
            fontSize: "24px",
          }}
        >
          Welcome back, @{username}!
        </div>
        <SessionBox
          headerText="Current Active Session"
          sessionText={
            hasActiveSession
              ? `Current active session with @${matchedUsername}`
              : "No active session. Ready for more?"
          }
          buttonText={hasActiveSession ? "Rejoin Session" : "New Question"}
          buttonLink="/new-session"
        />

        <SessionBox
          headerText="Go to Question Page"
          sessionText={
            isAdmin
              ? "Navigate to the question page to view, add, edit or delete questions."
              : "Navigate to the question page to view questions."
          }
          buttonText={isAdmin ? "Manage Questions" : "View Questions"}
          buttonLink="/questions"
        />
      </div>

      <div style={{ marginLeft: "20px", marginTop: "63px" }}>
        <Calendar
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
        />

        {/* Random Challenge Section */}
        {/* <RandomChallenge /> */}
      </div>

      <DropdownMenu
        dropdownVisible={dropdownVisible}
        toggleDropdown={toggleDropdown}
        navigate={navigate}
        confirmLogout={confirmLogout}
      />

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
