import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const AdminRoute: React.FC = () => {
  const authContext = useContext(AuthContext);

  if (!authContext || !authContext.authToken || !authContext.userRole) {
    return <Navigate to="/auth/signin" />;
  }

  // بررسی نقش کاربر
  return authContext.userRole === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/signin" />
  );
};

export default AdminRoute;
