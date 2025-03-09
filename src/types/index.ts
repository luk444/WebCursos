export interface User {
  id: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  hasAccess: boolean;
  createdAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  previewImageUrl?: string;
  telegramUrl?: string;
  modules: Module[];
  createdAt: Date;
  updatedAt: Date;
  highlights?: string[];
  requirements?: string[];
  targetAudience?: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  order: number;
  duration: number;
  resources?: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  type: 'link' | 'file';
  size?: string;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  lastAccessedAt: Date;
  certificateGenerated: boolean;
}

export interface VideoUploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'completed' | 'error';
  error?: string;
}