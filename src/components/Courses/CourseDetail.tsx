import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useCourses } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Lock, Play, Award, AlertCircle, GitBranch as BrandTelegram } from 'lucide-react';
import ModuleAccordion from './ModuleAccordion';
import VideoPlayer from './VideoPlayer';
import { generateCertificatePDF } from '../../utils/certificate';

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses, userProgress, getCourseProgress, markLessonAsCompleted } = useCourses();
  const { userData } = useAuth();
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);

  if (!courseId) return <Navigate to="/courses" />;
  
  const course = courses.find(c => c.id === courseId);
  if (!course) return <Navigate to="/courses" />;
  
  const hasAccess = userData?.hasAccess || false;
  const progress = getCourseProgress(courseId);
  const isCompleted = progress === 100;
  
  // Find current lesson details if a lesson is selected
  let currentLesson = null;
  if (currentLessonId) {
    for (const module of course.modules) {
      const lesson = module.lessons.find(l => l.id === currentLessonId);
      if (lesson) {
        currentLesson = lesson;
        break;
      }
    }
  } else if (!hasAccess) {
    // Auto-select first lesson for preview
    currentLesson = course.modules[0]?.lessons[0] || null;
  }

  const handleLessonComplete = async (lessonId: string) => {
    if (!hasAccess) return;
    await markLessonAsCompleted(courseId, lessonId);
  };
  
  const handleGenerateCertificate = async () => {
    if (!userData?.displayName || !isCompleted) return;
    
    try {
      setIsGeneratingCertificate(true);
      const pdfUrl = generateCertificatePDF(userData.displayName, course.title);
      setCertificateUrl(pdfUrl);
    } catch (error) {
      console.error('Error generating certificate:', error);
    } finally {
      setIsGeneratingCertificate(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-lg text-indigo-100 mb-6">{course.description}</p>
          
          {hasAccess && (
            <>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progreso del curso</span>
                  <span className="text-sm font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2.5">
                  <div 
                    className="bg-white h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {course.telegramUrl && (
                <div className="mt-4 bg-white/10 rounded-lg p-4">
                  <div className="flex items-center">
                    <BrandTelegram className="h-5 w-5 text-white mr-3" />
                    <div>
                      <h3 className="text-sm font-medium">Comunidad del Curso</h3>
                      <a
                        href={course.telegramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-100 hover:text-white flex items-center mt-1"
                      >
                        Unirse al grupo de Telegram
                        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {!hasAccess && (
            <div className="bg-white/10 rounded-lg p-4 mt-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-white mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium">Acceso de Prueba</h3>
                  <p className="mt-1 text-sm text-indigo-100">
                    Estás viendo la introducción gratuita. Obtén acceso completo para ver todo el contenido.
                  </p>
                  <a
                    href="/payment-instructions"
                    className="mt-3 inline-block px-4 py-2 bg-white text-indigo-600 rounded-md text-sm font-medium hover:bg-indigo-50 transition-colors"
                  >
                    Desbloquear Curso Completo
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          <div className="lg:col-span-2">
            {currentLesson ? (
              <div>
                <VideoPlayer 
                  lesson={currentLesson} 
                  courseId={courseId} 
                  hasAccess={hasAccess}
                  onComplete={() => handleLessonComplete(currentLesson.id)}
                />
                
                {hasAccess && !isCompleted && (
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => handleLessonComplete(currentLesson.id)}
                      className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Marcar como Completada
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 rounded-lg p-8 text-center h-96 flex flex-col items-center justify-center">
                <Play className="h-16 w-16 text-indigo-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-900">Selecciona una lección</h3>
                <p className="mt-2 text-gray-600">
                  Elige una lección del menú para comenzar a aprender.
                </p>
              </div>
            )}
            
            {isCompleted && hasAccess && (
              <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center">
                  <Award className="h-12 w-12 text-green-500 mr-4" />
                  <div>
                    <h3 className="text-xl font-bold text-green-800">¡Felicitaciones! Has completado el curso</h3>
                    <p className="text-green-700 mt-1">
                      Has demostrado dedicación y compromiso. Ahora puedes obtener tu certificado.
                    </p>
                  </div>
                </div>
                
                {certificateUrl ? (
                  <div className="mt-4">
                    <a 
                      href={certificateUrl}
                      download={`certificado_${course.title.toLowerCase().replace(/\s+/g, '_')}.pdf`}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Award className="h-5 w-5 mr-2" />
                      Descargar Certificado
                    </a>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateCertificate}
                    disabled={isGeneratingCertificate}
                    className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isGeneratingCertificate ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Generando...
                      </>
                    ) : (
                      <>
                        <Award className="h-5 w-5 mr-2" />
                        Generar Certificado
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contenido del Curso</h3>
              
              {course.modules.map((module, moduleIndex) => (
                <ModuleAccordion 
                  key={module.id} 
                  module={module} 
                  completedLessons={userProgress?.completedLessons || []}
                  onSelectLesson={setCurrentLessonId}
                  currentLessonId={currentLessonId}
                  hasAccess={hasAccess}
                  isFirstModule={moduleIndex === 0}
                />
              ))}

              {!hasAccess && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                  <h4 className="text-sm font-medium text-indigo-900 mb-2">¿Listo para acceder a todo el contenido?</h4>
                  <p className="text-sm text-indigo-700 mb-4">
                    Realiza el pago correspondiente para desbloquear todas las lecciones y obtener tu certificado al finalizar.
                  </p>
                  <a
                    href="/payment-instructions"
                    className="block w-full text-center py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium"
                  >
                    Ver Instrucciones de Pago
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;