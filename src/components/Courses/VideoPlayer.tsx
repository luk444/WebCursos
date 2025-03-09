import React, { useRef, useEffect, useState } from 'react';
import { Lock, Play, CheckCircle, Download } from 'lucide-react';
import { Resource } from '../../types';

interface VideoPlayerProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    resources?: Resource[];
  };
  courseId: string;
  hasAccess: boolean;
  onComplete?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ lesson, hasAccess, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleVideoEnd = () => {
    if (hasAccess && onComplete && !isCompleted) {
      onComplete();
      setIsCompleted(true);
    }
  };

  if (!hasAccess && !lesson.videoUrl.includes('preview')) {
    return (
      <div className="bg-black rounded-lg overflow-hidden">
        <div className="aspect-w-16 aspect-h-9 relative">
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-center p-6">
              <Lock className="h-16 w-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Contenido Bloqueado
              </h3>
              <p className="text-gray-400 mb-6">
                Obtén acceso completo para ver esta lección
              </p>
              <a
                href="/payment-instructions"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Desbloquear Acceso
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src={lesson.videoUrl}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          onEnded={handleVideoEnd}
        />
      </div>
      
      <div className="p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
          {hasAccess && (
            <button
              onClick={() => !isCompleted && onComplete?.()}
              className={`inline-flex items-center px-4 py-2 rounded-md ${
                isCompleted
                  ? 'bg-green-100 text-green-700'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Completada
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Marcar como Completada
                </>
              )}
            </button>
          )}
        </div>
        
        <p className="text-gray-600 mb-6">{lesson.description}</p>
        
        {lesson.resources && lesson.resources.length > 0 && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recursos de la Lección</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lesson.resources.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Download className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                    <p className="text-xs text-gray-500">{resource.type === 'file' ? 'Archivo' : 'Enlace'}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        
        {!hasAccess && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-700">
              Esta es una lección de muestra. Para acceder a todo el contenido, necesitas realizar el pago correspondiente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;