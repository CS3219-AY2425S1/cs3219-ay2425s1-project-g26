import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('accessToken') || null;
  });

  const login = (token) => {
    setAccessToken(token);
    localStorage.setItem('accessToken', token); 
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('accessToken'); 
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
