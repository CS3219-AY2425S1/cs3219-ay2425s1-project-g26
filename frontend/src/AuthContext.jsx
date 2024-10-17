import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('accessToken') || Cookies.get('accessToken') || null; 
  });
  
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || Cookies.get('userId') || null; 
  });

  const login = (token, id) => {
    setAccessToken(token);
    setUserId(id);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userId', id);
    Cookies.set('accessToken', token, { expires: 7 });
    Cookies.set('userId', id, { expires: 7 });
  };

  const logout = () => {
    setAccessToken(null);
    setUserId(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    Cookies.remove('accessToken');
    Cookies.remove('userId');
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken') || Cookies.get('accessToken');  
    const id = localStorage.getItem('userId') || Cookies.get('userId'); 

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
