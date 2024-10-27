import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext"; 
import { useNavigate } from "react-router-dom"; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import './styles/manageprofilepage.css'; 

const ManageProfilePage = () => {
  const { userId, accessToken, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHoveredBack, setIsHoveredBack] = useState(false);
  const [isHoveredSave, setIsHoveredSave] = useState(false); 
  const [isHoveredDelete, setIsHoveredDelete] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); 
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) { 
      fetchUserData();
    }
  }, [userId, accessToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = {};

    if (username) updatedUser.username = username;
    if (email) updatedUser.email = email;
    if (newPassword) updatedUser.password = newPassword;

    try {
      // Validate password confirmation
      if (newPassword !== confirmPassword) {
        throw new Error("New password and confirmation do not match.");
      }

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

      alert("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

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

      alert("Account deleted successfully!");

      logout();
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    navigate("/dashboard"); 
  };

  if (loading) return <p style={{ color: "white", textAlign: "center" }}>Loading...</p>; 
  if (error) return <p style={{ color: "white", textAlign: "center" }}>{error}</p>;

  return (
    <div className="container">
      <button
        className="button-back"
        onClick={handleBack}
        onMouseEnter={() => setIsHoveredBack(true)} 
        onMouseLeave={() => setIsHoveredBack(false)} 
      >
        Back
      </button>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="title">Manage Profile</div>

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

        {/* Change Password Header */}
        <div className="form-group">
          <h3 className="sub-title">Change Password</h3>
        </div>

        {/* Current Password Field */}
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

        {/* New Password Field */}
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

        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="confirmPassword" className="label">Confirm Password</label>
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
          type="submit"
          className="button-submit"
          onMouseEnter={() => setIsHoveredSave(true)}
          onMouseLeave={() => setIsHoveredSave(false)}
        >
          Save Changes
        </button>

        <button
          className="button-delete"
          onClick={handleDeleteAccount}
          onMouseEnter={() => setIsHoveredDelete(true)}
          onMouseLeave={() => setIsHoveredDelete(false)}
        >
          Delete Account
        </button>
      </form>
    </div>
  );
};

export default ManageProfilePage;