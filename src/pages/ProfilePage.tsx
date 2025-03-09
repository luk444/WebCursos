import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import { User, Mail, Calendar, Award } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { currentUser, userData, loading } = useAuth();
  const { courses, userProgress } = useCourses();
  
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Layout>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Calculate completed courses
  const completedCourses = courses.filter(course => {
    if (!userProgress) return false;
    
    // Count total lessons in the course
    const totalLessons = course.modules.reduce(
      (total, module) => total + module.lessons.length, 
      0
    );
    
    // Check if all lessons are completed
    return userProgress.completedLessons.length === totalLessons;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8 bg-indigo-600 text-white">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="h-24 w-24 rounded-full bg-indigo-300 flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
                <User className="h-12 w-12 text-indigo-700" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{userData?.displayName || 'Usuario'}</h1>
                <p className="text-indigo-200 mt-1">
                  {userData?.hasAccess ? 'Acceso Completo' : 'Acceso Pendiente'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-2">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Información Personal</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Correo Electrónico</p>
                      <p className="text-gray-900">{currentUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">ID de Usuario</p>
                      <p className="text-gray-900 font-mono text-sm">{currentUser.uid}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Fecha de Registro</p>
                      <p className="text-gray-900">
                        {userData?.createdAt instanceof Date 
                          ? userData.createdAt.toLocaleDateString() 
                          : new Date(userData?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Estado de Acceso</h2>
                  
                  {userData?.hasAccess ? (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Award className="h-5 w-5 text-green-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">Acceso Completo</h3>
                          <div className="mt-2 text-sm text-green-700">
                            <p>
                              Tienes acceso completo a todos los cursos de la plataforma. ¡Disfruta aprendiendo!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <Award className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">Acceso Pendiente</h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>
                              Tu acceso está pendiente de verificación. Por favor, sigue las instrucciones de pago para desbloquear todos los cursos.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen de Progreso</h2>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Cursos Inscritos</p>
                      <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Cursos Completados</p>
                      <p className="text-2xl font-bold text-gray-900">{completedCourses.length}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Certificados Obtenidos</p>
                      <p className="text-2xl font-bold text-gray-900">{userProgress?.certificateGenerated ? 1 : 0}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Progreso General</h3>
                    
                    {courses.length > 0 ? (
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ width: `${(completedCourses.length / courses.length) * 100}%` }}
                        ></div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No hay cursos disponibles</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;