import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/dashboard/Calendar";
import SessionBox from "../components/dashboard/SessionBox";
import ConfirmationModal from "../components/dashboard/ConfirmationModal";
import History from "../components/dashboard/History";
import withAuth from "../hoc/withAuth";
import { useAuth } from "../AuthContext";
import DropdownMenu from "../components/dashboard/DropdownMenu";
import AttemptDetail from "../components/dashboard/AttemptDetail";
import Dialog from "../components/question/Dialog";

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
  const [onlineDates, setOnlineDates] = useState(new Set());
  const [history, setHistory] = useState();
  const [dialogForm, setDialogForm] = useState(null);
  const dialogRef = useRef(null);

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

  const handleCloseDetail = () => {
    setDialogForm(null);
    toggleDialog();
  };

  function toggleDialog() {
    if (!dialogRef.current) {
      return;
    }

    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  }

  const handleViewHistory = async (attempt) => {
    setDialogForm(
      <AttemptDetail attempt={attempt} onClose={handleCloseDetail} />
    );
    toggleDialog();
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
        setOnlineDates(new Set(data.data.onlineDate));
        setHistory(data.data.history);

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
        flexDirection: "column",
        alignItems: "center",
      }}
    >

      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <div
            style={{
              backgroundColor: "#fff",
              color: "#000",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px 20px",
              borderRadius: "8px",
              marginLeft: "0px",
              marginBottom: "0px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              width: "740px",
              height: "100px",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              Welcome back, @{username}!
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: "normal",
                marginTop: "8px",
              }}
            >
              We hope you are having a great day.
            </div>
          </div>
          <div
          style={{
            display: "flex",
            gap: "20px",
              justifyContent: "center",
            marginTop: "35px",
            marginBottom: "0px",
            }}
          >
            <SessionBox
              headerText="Current Active Session"
              sessionText={
                hasActiveSession
                  ? (
                      <>
                        Current active session with
                        <br />
                        <strong>@{matchedUsername}</strong>
                      </>
                    )
                  : (
                      <>
                        No active session.
                        <br />
                        Ready for more?
                      </>
                    )
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
          </div>

        <div>
          <Calendar
            currentMonth={currentMonth}
            currentYear={currentYear}
            setCurrentMonth={setCurrentMonth}
            setCurrentYear={setCurrentYear}
            onlineDates={onlineDates}
            />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "5px",
          width: "100%",
          maxWidth: "1180px",
        }}
      >
        <History
          history={history}
          onView={handleViewHistory}
        />
      </div>

      <Dialog toggleDialog={toggleDialog} ref={dialogRef}>
        {dialogForm}
      </Dialog>

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
