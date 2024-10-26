import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => Cookies.get('accessToken') || null);
  const [userId, setUserId] = useState(() => Cookies.get('userId') || null);

  const login = (token, id) => {
    setAccessToken(token);
    setUserId(id);
    Cookies.set('accessToken', token, { secure: true, sameSite: 'strict' });
    Cookies.set('userId', id, { secure: true, sameSite: 'strict' });
  };

  const logout = () => {
    setAccessToken(null);
    setUserId(null);
    Cookies.remove('accessToken');
    Cookies.remove('userId');
  };

  useEffect(() => {
    setAccessToken(Cookies.get('accessToken') || null);
    setUserId(Cookies.get('userId') || null);
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
