import React from 'react';
import { useCourses } from '../../context/CourseContext';
import CourseCard from './CourseCard';
import { BookOpen } from 'lucide-react';

const CourseList: React.FC = () => {
  const { courses, loading } = useCourses();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 mx-auto text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No hay cursos disponibles</h3>
        <p className="mt-2 text-sm text-gray-500">
          No se encontraron cursos disponibles en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
};

export default CourseList;