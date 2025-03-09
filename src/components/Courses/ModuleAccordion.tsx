import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, Lock, Play } from 'lucide-react';
import { Module } from '../../types';

interface ModuleAccordionProps {
  module: Module;
  completedLessons: string[];
  onSelectLesson: (lessonId: string) => void;
  currentLessonId: string | null;
  hasAccess: boolean;
  isFirstModule: boolean;
}

const ModuleAccordion: React.FC<ModuleAccordionProps> = ({ 
  module, 
  completedLessons, 
  onSelectLesson,
  currentLessonId,
  hasAccess,
  isFirstModule
}) => {
  const [isOpen, setIsOpen] = useState(isFirstModule);
  
  // Calculate module progress
  const totalLessons = module.lessons.length;
  const completedModuleLessons = module.lessons.filter(lesson => 
    completedLessons.includes(lesson.id)
  ).length;
  
  const progress = totalLessons > 0 
    ? (completedModuleLessons / totalLessons) * 100 
    : 0;

  return (
    <div className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <div className="mr-3">
            {progress === 100 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-indigo-500 flex items-center justify-center text-xs font-medium text-indigo-500">
                {Math.round(progress)}%
              </div>
            )}
          </div>
          <span className="font-medium text-gray-900">{module.title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      
      {isOpen && (
        <div className="border-t border-gray-200">
          {module.lessons.map((lesson, lessonIndex) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isActive = currentLessonId === lesson.id;
            const isPreviewLesson = isFirstModule && lessonIndex === 0;
            const canAccess = hasAccess || isPreviewLesson;
            
            return (
              <button
                key={lesson.id}
                className={`w-full flex items-center p-3 hover:bg-gray-50 focus:outline-none ${
                  isActive ? 'bg-indigo-50' : ''
                } ${!canAccess ? 'cursor-not-allowed opacity-75' : ''}`}
                onClick={() => canAccess && onSelectLesson(lesson.id)}
                disabled={!canAccess}
              >
                <div className="mr-3">
                  {!canAccess ? (
                    <Lock className="h-5 w-5 text-gray-400" />
                  ) : isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Play className="h-5 w-5 text-indigo-500" />
                  )}
                </div>
                <div className="text-left flex-grow">
                  <p className={`font-medium ${
                    isActive ? 'text-indigo-700' : 
                    !canAccess ? 'text-gray-400' : 'text-gray-900'
                  }`}>
                    {lesson.title}
                  </p>
                  <p className="text-sm text-gray-500">{lesson.duration} min</p>
                </div>
                {isPreviewLesson && !hasAccess && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                    Gratis
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ModuleAccordion;