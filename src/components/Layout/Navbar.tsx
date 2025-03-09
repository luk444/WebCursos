import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">Plataforma de Capacitación</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {currentUser ? (
              <>
                {userData?.isAdmin && (
                  <Link 
                    to="/admin" 
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                  >
                    Panel de Administración
                  </Link>
                )}
                <Link 
                  to="/courses" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                >
                  Mis Cursos
                </Link>
                <Link 
                  to="/profile" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500 flex items-center"
                >
                  <User className="h-4 w-4 mr-1" />
                  {userData?.displayName || 'Perfil'}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium bg-indigo-700 hover:bg-indigo-800 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-500"
                >
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium bg-indigo-700 hover:bg-indigo-800"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;