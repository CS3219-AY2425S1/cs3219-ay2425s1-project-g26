import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('accessToken') || null;
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || null;
  });

  const login = (token, id) => {
    setAccessToken(token);
    setUserId(id);
    localStorage.setItem('accessToken', token); 
    localStorage.setItem('userId', id); 
  };

  const logout = () => {
    setAccessToken(null);
    setUserId(null);
    localStorage.removeItem('accessToken'); 
    localStorage.removeItem('userId'); 
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const id = localStorage.getItem('userId');

    if (token) {
      setAccessToken(token);
    }
    if (id) {
      setUserId(id);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
