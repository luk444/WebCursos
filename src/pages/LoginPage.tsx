import React from 'react';
import Layout from '../components/Layout/Layout';
import LoginForm from '../components/Auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;