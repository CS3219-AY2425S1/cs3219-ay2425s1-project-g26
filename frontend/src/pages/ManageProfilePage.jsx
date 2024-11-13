import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext"; 
import { useNavigate } from "react-router-dom"; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import Toast from './styles/Toast';
import './styles/manageprofilepage.css'; 
import withAuth from "../hoc/withAuth";

const ManageProfilePage = () => {
  const { userId, accessToken, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [isHoveredBack, setIsHoveredBack] = useState(false);
  const [isHoveredSave, setIsHoveredSave] = useState(false); 
  const [isHoveredDelete, setIsHoveredDelete] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); 
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const navigate = useNavigate();

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/users/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data.");
        }

        const data = await response.json();
        setUsername(data.data.username);
        setEmail(data.data.email);
      } catch (err) {
        setToastMessage({ message: err.message, type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (userId) { 
      fetchUserData();
    }
  }, [userId, accessToken]);

  const handleVerifyPassword = async () => {
    try {
      const response = await fetch(`http://localhost:8081/users/verify-password`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, currentPassword })
      });

      if (!response.ok) {
        throw new Error("Current password is incorrect.");
      }

      return true;
    } catch (err) {
      setToastMessage({ message: err.message, type: 'error' });
      return false; 
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const updatedUser = { username, email: email.toLowerCase() };

    try {
      const response = await fetch(`http://localhost:8081/users/${userId}`, {
        method: 'PATCH', 
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      });

      if (!response.ok) {
        throw new Error("Failed to update profile.");
      }

      setToastMessage({ message: "Profile updated successfully!", type: 'success' });
    } catch (err) {
      setToastMessage({ message: err.message, type: 'error' });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate password
    if (!passwordPattern.test(newPassword)) {
      setToastMessage({ message: 'Password must be at least 8 characters long, include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.', type: 'error' });
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      return setToastMessage({ message: "New password and confirmation do not match.", type: 'error' });
    }

    const isVerified = await handleVerifyPassword();
    if (!isVerified) {
      return;
    }

    try {
      const updatedPassword = { password: newPassword };

      const response = await fetch(`http://localhost:8081/users/${userId}`, {
        method: 'PATCH', 
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPassword)
      });

      if (!response.ok) {
        throw new Error("Failed to update password.");
      }

      setToastMessage({ message: "Password changed successfully!", type: 'success' });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setToastMessage({ message: err.message, type: 'error' });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8081/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete account.");
      }

      setToastMessage({ message: "Account deleted successfully!", type: 'success' });
      logout();
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
    } catch (err) {
      setToastMessage({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/dashboard"); 
  };

  if (loading) return <p style={{ color: "white", textAlign: "center" }}>Loading...</p>; 

  return (
    <div className="container">
      {toastMessage && <Toast message={toastMessage.message} type={toastMessage.type} />}
      
      <button
        className="button-back"
        onClick={handleBack}
        onMouseEnter={() => setIsHoveredBack(true)} 
        onMouseLeave={() => setIsHoveredBack(false)} 
      >
        Back
      </button>

      <form className="form-container">
        <div className="title"> Manage Profile</div>

        <div className="form-group">
          <label htmlFor="username" className="label">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="off"
            placeholder="Leave blank to keep current username"
            className="input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="label">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off" 
            placeholder="Leave blank to keep current email"
            className="input"
          />
        </div>

        <button
          onClick={handleSaveChanges}
          className="button-submit"
          onMouseEnter={() => setIsHoveredSave(true)}
          onMouseLeave={() => setIsHoveredSave(false)}
          style={{ marginBottom: '150px' }}
        >
          Save Changes
        </button>

        <div className="title"> Change Password</div>

        <div className="form-group">
          <label htmlFor="currentPassword" className="label">Current Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="input"
            />
            <span className="password-eye" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
              {showCurrentPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="newPassword" className="label">New Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="input"
            />
            <span className="password-eye" onClick={() => setShowNewPassword(!showNewPassword)}>
              {showNewPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="label">Confirm New Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="input"
            />
            <span className="password-eye" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>

        <button
          onClick={handleChangePassword}
          className="button-submit"
          onMouseEnter={() => setIsHoveredSave(true)}
          onMouseLeave={() => setIsHoveredSave(false)}
          style={{ marginBottom: '150px' }}
        >
          Change Password
        </button>

        <button
          onClick={handleDeleteAccount}
          className="button-delete"
          onMouseEnter={() => setIsHoveredDelete(true)}
          onMouseLeave={() => setIsHoveredDelete(false)}
          style={{ marginBottom: '50px' }}
        >
          Delete Account
        </button>
      </form>
    </div>
  );
};

const WrappedManageProfilePage = withAuth(ManageProfilePage);
export default WrappedManageProfilePage;
