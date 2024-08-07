// components/ProtectedAdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import Msg from './Msg';


const ProtectedAdminRoute = ({ children }) => {
  const authToken = localStorage.getItem('authToken');
  const user = JSON.parse(localStorage.getItem('user')); 
  if (!authToken || !user || user.its_admin !== 0) {
    return <Msg/>;
  }

  return children;
};

export default ProtectedAdminRoute;
