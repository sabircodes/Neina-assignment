// src/contexts/UserContext.js
import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Logout function to clear token and user data
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  // Fetch user info if token exists
  const getUserInfo = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:7000/api/user/v1/get-users-info', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching user info:', error);
      logout(); // Log out if token is invalid or expired
    }
  };

  // Load user info on mount if token is available
  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ user, logout,setUser }}>
      {children}
    </UserContext.Provider>
  );
};