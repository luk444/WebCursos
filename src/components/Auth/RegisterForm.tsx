import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle } from 'lucide-react';

interface RegisterFormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminCode?: string;
}

const ADMIN_SECRET_CODE = 'ADMIN123'; // Cambia esto por un código seguro

const RegisterForm: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAdminField, setShowAdminField] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      setLoading(true);
      
      const isAdmin = data.adminCode === ADMIN_SECRET_CODE;
      
      await registerUser(data.email, data.password, data.displayName, isAdmin);
      navigate(isAdmin ? '/admin' : '/payment-instructions');
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Crear Cuenta</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="displayName" className="block text-gray-700 text-sm font-medium mb-1">
            Nombre Completo
          </label>
          <input
            id="displayName"
            type="text"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.displayName ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('displayName', { 
              required: 'El nombre es requerido',
              minLength: {
                value: 2,
                message: 'El nombre debe tener al menos 2 caracteres'
              }
            })}
          />
          {errors.displayName && (
            <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('email', { 
              required: 'El correo electrónico es requerido',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Dirección de correo inválida'
              }
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('password', { 
              required: 'La contraseña es requerida',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres'
              }
            })}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-1">
            Confirmar Contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('confirmPassword', { 
              required: 'Confirma tu contraseña',
              validate: value => value === password || 'Las contraseñas no coinciden'
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="mb-6">
          <button
            type="button"
            onClick={() => setShowAdminField(!showAdminField)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            {showAdminField ? 'Ocultar código de administrador' : '¿Eres administrador?'}
          </button>

          {showAdminField && (
            <div className="mt-4">
              <label htmlFor="adminCode" className="block text-gray-700 text-sm font-medium mb-1">
                Código de Administrador
              </label>
              <input
                id="adminCode"
                type="password"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300"
                {...register('adminCode')}
              />
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;