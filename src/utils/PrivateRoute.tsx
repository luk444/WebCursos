import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  requireAdmin?: boolean;
  requireAccess?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  requireAdmin = false,
  requireAccess = false
}) => {
  const { currentUser, userData, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && !userData?.isAdmin) {
    return <Navigate to="/" />;
  }
  
  if (requireAccess && !userData?.hasAccess) {
    return <Navigate to="/payment-instructions" />;
  }
  
  return <Outlet />;
};

export default PrivateRoute;