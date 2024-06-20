import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    username: '',
    role: '',
    userId: '',
    firstname: '',
    lastname: '',
    phone: '',
    email: ''
  });

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

  const updateCurrentUser = (newUserData) => {
    setUserData(newUserData);
  };

  const handleLogin = () => {
    fetchCurrentUser();
  };

  const Logout = () => {
    setUserData({
      username: '',
      role: '',
      userId: '',
      firstname: '',
      lastname: '',
      phone: '',
      email: ''
    });
  };

  return (
    <UserContext.Provider
      value={{
        currentUser: userData.username,
        role: userData.role,
        userId: userData.userId,
        firstname: userData.firstname,
        lastname: userData.lastname,
        phone: userData.phone,
        email: userData.email,
        handleLogin,
        updateCurrentUser,
        Logout
      }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
