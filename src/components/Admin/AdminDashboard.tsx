import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Award, DollarSign, Upload, Plus } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import UserList from './UserList';
import CourseManager from './CourseManager';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'courses'>('users');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalCertificates: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch users count (excluding admins)
        const usersQuery = query(
          collection(db, 'users'),
          where('isAdmin', '==', false)
        );
        const usersSnapshot = await getDocs(usersQuery);
        const usersCount = usersSnapshot.docs.length;

        // Fetch courses count
        const coursesSnapshot = await getDocs(collection(db, 'courses'));
        const coursesCount = coursesSnapshot.docs.length;

        // Fetch certificates count (users with certificateGenerated = true)
        const progressSnapshot = await getDocs(collection(db, 'userProgress'));
        const certificatesCount = progressSnapshot.docs.filter(
          doc => doc.data().certificateGenerated
        ).length;

        // Calculate total revenue ($99.99 per user with access)
        const usersWithAccess = usersSnapshot.docs.filter(
          doc => doc.data().hasAccess
        ).length;
        const revenue = usersWithAccess * 99.99;

        setStats({
          totalUsers: usersCount,
          totalCourses: coursesCount,
          totalCertificates: certificatesCount,
          totalRevenue: revenue
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Panel de Administración</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <Users className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">Usuarios</h2>
              <p className="text-3xl font-bold text-gray-700">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <BookOpen className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">Cursos</h2>
              <p className="text-3xl font-bold text-gray-700">{stats.totalCourses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Award className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">Certificados</h2>
              <p className="text-3xl font-bold text-gray-700">{stats.totalCertificates}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <DollarSign className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">Ingresos</h2>
              <p className="text-3xl font-bold text-gray-700">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('users')}
              className={`w-1/2 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gestión de Usuarios
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`w-1/2 py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'courses'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Gestión de Cursos
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' ? <UserList /> : <CourseManager />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;