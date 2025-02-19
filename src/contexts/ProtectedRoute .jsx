// ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(UserContext);

  // If the user is not logged in, redirect to login.
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If the user's role is not in the allowed roles, redirect them.
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
