import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';
import PrivateRoute from './utils/PrivateRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import PaymentInstructionsPage from './pages/PaymentInstructionsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CourseProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/payment-instructions" element={<PaymentInstructionsPage />} />
              <Route path="/courses" element={<CoursesPage />} />
            </Route>
            
            {/* Protected Routes - Require Authentication and Course Access */}
            <Route element={<PrivateRoute requireAccess={true} />}>
              <Route path="/courses/:courseId" element={<CourseDetailPage />} />
            </Route>
            
            {/* Admin Routes */}
            <Route element={<PrivateRoute requireAdmin={true} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Routes>
        </CourseProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;