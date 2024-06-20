import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import LogoutIcon from '@mui/icons-material/Logout';

const Logout = () => {
  const navigate = useNavigate();
  const { Logout } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      const response = await fetch('https://artify-backend-0eef31091a04.herokuapp.com/api/users/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        Logout();
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <LogoutIcon onClick={handleLogout} className="hover:cursor-pointer hover:text-hoverColor" />
  );
};

export default Logout;
