export const getYouTubeEmbedUrl = (url: string): string => {
    try {
      const videoId = extractYouTubeVideoId(url);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
      return '';
    }
  };
  
  export const extractYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/,
      /^[a-zA-Z0-9_-]{11}$/
    ];
  
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
  
    return null;
  };
  
  export const validateYouTubeUrl = (url: string): boolean => {
    return !!extractYouTubeVideoId(url);
  };