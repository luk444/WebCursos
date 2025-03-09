import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, arrayUnion, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Course, UserProgress } from '../types';
import { useAuth } from './AuthContext';

interface CourseContextType {
  courses: Course[];
  loading: boolean;
  userProgress: UserProgress | null;
  markLessonAsCompleted: (courseId: string, lessonId: string) => Promise<void>;
  getCourseProgress: (courseId: string) => number;
  generateCertificate: (courseId: string, userName: string) => Promise<string>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesCollection = collection(db, 'courses');
        const coursesSnapshot = await getDocs(coursesCollection);
        const coursesList = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          modules: doc.data().modules || []
        })) as Course[];
        
        coursesList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setCourses(coursesList);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!currentUser) {
        setUserProgress(null);
        return;
      }

      try {
        const progressRef = doc(db, 'userProgress', currentUser.uid);
        const progressDoc = await getDoc(progressRef);
        
        if (progressDoc.exists()) {
          const progressData = progressDoc.data() as UserProgress;
          setUserProgress(progressData);
        } else {
          // Initialize empty progress
          const initialProgress: UserProgress = {
            userId: currentUser.uid,
            completedLessons: [],
            lastAccessedAt: new Date(),
            certificateGenerated: false
          };
          await setDoc(progressRef, initialProgress);
          setUserProgress(initialProgress);
        }
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };

    fetchUserProgress();
  }, [currentUser]);

  const markLessonAsCompleted = async (courseId: string, lessonId: string) => {
    if (!currentUser || !userProgress) return;

    try {
      const progressRef = doc(db, 'userProgress', currentUser.uid);
      
      // Verificar si la lección ya está completada
      if (!userProgress.completedLessons.includes(lessonId)) {
        const updatedProgress = {
          ...userProgress,
          completedLessons: [...userProgress.completedLessons, lessonId],
          lastAccessedAt: new Date()
        };

        await updateDoc(progressRef, {
          completedLessons: arrayUnion(lessonId),
          lastAccessedAt: new Date()
        });

        setUserProgress(updatedProgress);
      }
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
    }
  };

  const getCourseProgress = (courseId: string): number => {
    if (!userProgress || !courseId) return 0;

    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;

    // Contar lecciones totales del curso
    const totalLessons = course.modules.reduce(
      (total, module) => total + module.lessons.length,
      0
    );

    if (totalLessons === 0) return 0;

    // Contar lecciones completadas del curso específico
    const completedLessons = course.modules.reduce((total, module) => {
      return total + module.lessons.filter(lesson => 
        userProgress.completedLessons.includes(lesson.id)
      ).length;
    }, 0);

    return Math.round((completedLessons / totalLessons) * 100);
  };

  const generateCertificate = async (courseId: string, userName: string): Promise<string> => {
    if (!currentUser) throw new Error('User not authenticated');

    try {
      const progressRef = doc(db, 'userProgress', currentUser.uid);
      await updateDoc(progressRef, {
        certificateGenerated: true
      });

      if (userProgress) {
        setUserProgress({
          ...userProgress,
          certificateGenerated: true
        });
      }

      return `certificate_${courseId}_${currentUser.uid}.pdf`;
    } catch (error) {
      console.error('Error generating certificate:', error);
      throw error;
    }
  };

  const value = {
    courses,
    loading,
    userProgress,
    markLessonAsCompleted,
    getCourseProgress,
    generateCertificate
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};