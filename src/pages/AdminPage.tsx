import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AdminDashboard from '../components/Admin/AdminDashboard';
import { useAuth } from '../context/AuthContext';

const AdminPage: React.FC = () => {
  const { userData, loading } = useAuth();
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Layout>
    );
  }
  
  // Redirect if user is not an admin
  if (!userData?.isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <AdminDashboard />
    </Layout>
  );
};

export default AdminPage;