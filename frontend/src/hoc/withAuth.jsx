import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../AuthContext'; 

const withAuth = (WrappedComponent) => {
  const AuthHOC = (props) => {
    const navigate = useNavigate();
    const { accessToken, logout } = useAuth(); 

    useEffect(() => {
      const checkAuth = async () => {
        if (!accessToken) {
          console.error("No access token found. Redirecting to login.");
          logout(); 
          navigate('/login');
          return;
        }

        try {
          const response = await fetch('http://localhost:8081/auth/verify-token', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to verify token");
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          logout();
          navigate('/login');
        }
      };

      checkAuth();
    }, [accessToken, navigate, logout]);

    return <WrappedComponent {...props} />;
  };

  AuthHOC.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthHOC;
};

export default withAuth;
