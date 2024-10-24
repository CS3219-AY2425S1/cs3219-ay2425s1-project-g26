import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext"; 
import { useNavigate } from "react-router-dom"; 
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const ManageProfilePage = () => {
  const { userId, accessToken, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHoveredBack, setIsHoveredBack] = useState(false);
  const [isHoveredSave, setIsHoveredSave] = useState(false); 
  const [isHoveredDelete, setIsHoveredDelete] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
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
    if (password) updatedUser.password = password;

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
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh", 
      textAlign: "center", 
      color: "white",
      position: "relative" 
    }}>
      <button
        onClick={handleBack}
        onMouseEnter={() => setIsHoveredBack(true)} 
        onMouseLeave={() => setIsHoveredBack(false)} 
        style={{
          position: "absolute", 
          top: "30px", 
          left: "30px", 
          padding: "15px 30px",
          backgroundColor: isHoveredBack ? '#f0f0f0' : 'white', 
          color: isHoveredBack ? 'black' : 'black',
          border: "none",
          borderRadius: "15px",
          cursor: "pointer",
          fontSize: '16px',
          fontFamily: 'Figtree',
          transition: "background-color 0.3s",
        }}
      >
        Back
      </button>

      <form onSubmit={handleSubmit} style={{ maxWidth: "400px", width: "100%", margin: "0 auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <div style={{ 
            fontSize: "24px", 
            fontWeight: "600", 
            marginBottom: "20px" 
          }}>
            Manage Profile
          </div>
        </div>

        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <label htmlFor="username" style={{ fontSize: "16px", fontWeight: "500", color: "#e0e0e0" }}>Username</label>
          <div>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              placeholder="Leave blank to keep current username"
              style={{
                border: "none",
                borderBottom: "2px solid #e0e0e0",
                outline: "none",
                backgroundColor: "transparent",
                color: "white",
                fontSize: "18px",
                fontFamily: 'Figtree', // Ensure Figtree font
                marginTop: "5px",
                width: "100%",
                padding: "5px 0",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#f0f0f0"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <label htmlFor="email" style={{ fontSize: "16px", fontWeight: "500", color: "#e0e0e0" }}>Email</label>
          <div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off" 
              placeholder="Leave blank to keep current email"
              style={{
                border: "none",
                borderBottom: "2px solid #e0e0e0",
                outline: "none",
                backgroundColor: "transparent",
                color: "white",
                fontSize: "18px",
                fontFamily: 'Figtree', 
                marginTop: "5px",
                width: "100%",
                padding: "5px 0",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#f0f0f0"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>
        </div>

        <div style={{ marginBottom: "20px", textAlign: "left" }}>
          <label htmlFor="password" style={{ fontSize: "16px", fontWeight: "500", color: "#e0e0e0" }}>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? 'text' : 'password'} 
              id="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              autoComplete="off" 
              style={{
                border: "none",
                borderBottom: "2px solid #e0e0e0",
                outline: "none",
                backgroundColor: "transparent",
                color: "white",
                fontSize: "18px",
                fontFamily: 'Figtree', // Ensure Figtree font
                marginTop: "5px",
                width: "100%",
                padding: "5px 0",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#f0f0f0"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />
            <div 
              onClick={() => setShowPassword(!showPassword)} 
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#e0e0e0",
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Eye icon */}
            </div>
          </div>
        </div>

        <button
          type="submit"
          onMouseEnter={() => setIsHoveredSave(true)} 
          onMouseLeave={() => setIsHoveredSave(false)} 
          style={{
            marginTop: "30px",
            padding: "10px 0", 
            backgroundColor: isHoveredSave ? '#f0f0f0' : 'white',
            color: 'black',
            border: "none",
            borderRadius: "15px",
            cursor: "pointer",
            fontSize: '16px',
            fontFamily: 'Figtree',
            transition: "background-color 0.3s",
            width: "100%", 
            height: "50px", 
          }}
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={handleDeleteAccount}
          onMouseEnter={() => setIsHoveredDelete(true)} 
          onMouseLeave={() => setIsHoveredDelete(false)} 
          style={{
            marginTop: "70px", 
            padding: "10px 0", 
            backgroundColor: isHoveredDelete ? '#cc0000' : '#990000', 
            color: 'white',
            border: "none",
            borderRadius: "15px",
            cursor: "pointer",
            fontSize: '16px',
            fontFamily: 'Figtree',
            transition: "background-color 0.3s",
            width: "100%",
            height: "50px", 
          }}
        >
          Delete Account
        </button>
      </form>
    </div>
  );
};

export default ManageProfilePage;
