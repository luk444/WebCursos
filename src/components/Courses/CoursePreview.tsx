import React from 'react';
import { Course } from '../../types';
import { GitBranch as BrandTelegram, Users, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CoursePreviewProps {
  course: Course;
  hasAccess: boolean;
}

const CoursePreview: React.FC<CoursePreviewProps> = ({ course, hasAccess }) => {
  // Calculate total duration and lessons
  const totalLessons = course.modules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );
  
  const totalDuration = course.modules.reduce(
    (total, module) => total + module.lessons.reduce(
      (moduleTotal, lesson) => moduleTotal + lesson.duration,
      0
    ),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Hero Section */}
        <div className="relative">
          <img
            src={course.previewImageUrl || `https://source.unsplash.com/random/1200x400?education,${course.id}`}
            alt={course.title}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-gray-200 mb-6">{course.description}</p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span>{course.modules.length} módulos</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{totalDuration} minutos</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{totalLessons} lecciones</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* What You'll Learn */}
            {course.highlights && course.highlights.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Lo que aprenderás</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Requisitos previos</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {course.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Target Audience */}
            {course.targetAudience && course.targetAudience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">¿Para quién es este curso?</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {course.targetAudience.map((audience, index) => (
                    <li key={index}>{audience}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Content */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Contenido del curso</h2>
              <div className="space-y-4">
                {course.modules.map((module, index) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg">
                    <div className="p-4 bg-gray-50">
                      <h3 className="font-medium">{module.title}</h3>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lesson.id} className="flex items-center text-gray-700">
                            <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs mr-3">
                              {lessonIndex + 1}
                            </span>
                            {lesson.title}
                            {!hasAccess && lessonIndex > 0 && (
                              <span className="ml-auto text-sm text-gray-500">Bloqueado</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              {hasAccess ? (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">¡Ya tienes acceso!</h3>
                  <p className="text-gray-600 mb-6">
                    Continúa con tu aprendizaje y accede a todo el contenido del curso.
                  </p>
                  <Link
                    to={`/courses/${course.id}`}
                    className="block w-full text-center py-3 px-4 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                  >
                    Continuar Curso
                  </Link>
                  
                  {course.telegramUrl && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-start">
                        <BrandTelegram className="h-6 w-6 text-blue-500 mr-3" />
                        <div>
                          <h4 className="font-medium text-blue-900">Comunidad de Telegram</h4>
                          <p className="text-sm text-blue-700 mb-3">
                            Únete a nuestra comunidad para obtener soporte y conectar con otros estudiantes.
                          </p>
                          <a
                            href={course.telegramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            Unirse al grupo
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">$99.99 USD</h3>
                    <p className="text-gray-600 mb-6">Acceso completo de por vida</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center text-gray-700">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      Acceso a todas las lecciones
                    </li>
                    <li className="flex items-center text-gray-700">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      Certificado de finalización
                    </li>
                    <li className="flex items-center text-gray-700">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      Soporte técnico
                    </li>
                    {course.telegramUrl && (
                      <li className="flex items-center text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        Acceso a comunidad de Telegram
                      </li>
                    )}
                  </ul>
                  
                  <Link
                    to="/payment-instructions"
                    className="block w-full text-center py-3 px-4 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                  >
                    Obtener Acceso
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;