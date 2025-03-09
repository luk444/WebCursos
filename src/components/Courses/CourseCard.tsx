import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Lock, Play } from 'lucide-react';
import { Course } from '../../types';
import { useCourses } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const { getCourseProgress } = useCourses();
  const { userData } = useAuth();
  
  const progress = getCourseProgress(course.id);
  const hasAccess = userData?.hasAccess || false;
  
  // Calculate total lessons
  const totalLessons = course.modules.reduce(
    (total, module) => total + module.lessons.length, 
    0
  );
  
  // Calculate total duration in minutes
  const totalDuration = course.modules.reduce(
    (total, module) => 
      total + module.lessons.reduce(
        (moduleTotal, lesson) => moduleTotal + lesson.duration, 
        0
      ), 
    0
  );

  // Función para manejar errores de carga de imagen
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    console.log('Error loading image:', target.src);
    target.src = `https://source.unsplash.com/random/800x600?education,${course.id}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-48">
        <img 
          src={course.previewImageUrl || `https://source.unsplash.com/random/800x600?education,${course.id}`}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        {!hasAccess && (
          <div className="absolute top-2 right-2">
            <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Lock className="h-4 w-4 mr-1" />
              Acceso Limitado
            </div>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center text-gray-500 mb-4">
          <BookOpen className="h-4 w-4 mr-1" />
          <span className="text-sm">{course.modules.length} módulos • {totalLessons} lecciones</span>
        </div>
        
        <div className="flex items-center text-gray-500 mb-4">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">{totalDuration} minutos</span>
        </div>
        
        {hasAccess && progress > 0 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% completado</p>
          </div>
        )}
        
        <div className="space-y-2">
          <Link 
            to={`/courses/${course.id}`}
            className="block w-full text-center py-2 px-4 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {hasAccess ? (
              progress > 0 ? 'Continuar Curso' : 'Comenzar Curso'
            ) : (
              'Ver Detalles'
            )}
          </Link>
          
          {!hasAccess && course.modules[0]?.lessons[0] && (
            <Link 
              to={`/courses/${course.id}`}
              className="block w-full text-center py-2 px-4 rounded-md border border-indigo-600 text-indigo-600 hover:bg-indigo-50 flex items-center justify-center"
            >
              <Play className="h-4 w-4 mr-2" />
              Ver Introducción Gratuita
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;