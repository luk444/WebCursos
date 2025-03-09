import React from 'react';
import Layout from '../components/Layout/Layout';
import CourseList from '../components/Courses/CourseList';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const CoursesPage: React.FC = () => {
  const { userData } = useAuth();
  const hasAccess = userData?.hasAccess || false;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Cursos Disponibles</h1>
        <p className="text-gray-600 mb-8">Explora nuestra selección de cursos de capacitación profesional.</p>
        
        {!hasAccess && (
          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Acceso Restringido</h3>
              <p className="mt-1 text-sm text-yellow-700">
                Para acceder al contenido completo de los cursos, debes realizar el pago correspondiente.{' '}
                <Link to="/payment-instructions" className="font-medium text-yellow-800 underline">
                  Ver instrucciones de pago
                </Link>
              </p>
            </div>
          </div>
        )}
        
        <CourseList />
      </div>
    </Layout>
  );
};

export default CoursesPage;