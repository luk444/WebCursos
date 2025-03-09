import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import CourseDetail from '../components/Courses/CourseDetail';
import CoursePreview from '../components/Courses/CoursePreview';
import { useCourses } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses } = useCourses();
  const { userData } = useAuth();
  
  if (!courseId) return <Navigate to="/courses" />;
  
  const course = courses.find(c => c.id === courseId);
  if (!course) return <Navigate to="/courses" />;
  
  const hasAccess = userData?.hasAccess || false;

  return (
    <Layout>
      {hasAccess ? (
        <CourseDetail />
      ) : (
        <CoursePreview course={course} hasAccess={hasAccess} />
      )}
    </Layout>
  );
};

export default CourseDetailPage;