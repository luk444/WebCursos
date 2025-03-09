import React from 'react';
import { getYouTubeEmbedUrl } from '../../utils/videoHelpers';

interface VideoPreviewProps {
  url: string;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ url }) => {
  const embedUrl = getYouTubeEmbedUrl(url);
  
  if (!embedUrl) {
    return (
      <div className="bg-gray-100 rounded-md p-4 text-center text-gray-500">
        URL de video inválida
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        src={embedUrl}
        title="Video Preview"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full rounded-md"
      />
    </div>
  );
};