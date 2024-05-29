import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({ username: '', role: '' });

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users/get-username', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error('Failed to fetch current user');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handleLogin = () => {
    fetchCurrentUser();
  };

  const Logout = () => {
    setUserData({ username: '', role: '' });
  };

  return (
    <UserContext.Provider
      value={{ currentUser: userData.username, role: userData.role, handleLogin, Logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };

UserProvider.propTypes = {
  children: PropTypes.node.isRequired
};
