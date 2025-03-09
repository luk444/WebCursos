import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, Users, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout/Layout';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Plataforma de Capacitación Profesional
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Accede a cursos de alta calidad y obtén certificados que impulsarán tu carrera profesional.
            </p>
            <div className="mt-10">
              <Link
                to="/courses"
                className="inline-block bg-white text-indigo-700 px-8 py-3 rounded-md text-lg font-medium shadow-lg hover:bg-gray-100 transition-colors"
              >
                Ver Cursos Disponibles
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">¿Por qué elegirnos?</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Nuestra plataforma ofrece una experiencia de aprendizaje única con contenido de calidad y certificaciones reconocidas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full text-indigo-600 mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Contenido de Calidad</h3>
              <p className="text-gray-600">
                Cursos diseñados por expertos con material actualizado y relevante para el mercado laboral actual.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full text-indigo-600 mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Certificaciones</h3>
              <p className="text-gray-600">
                Obtén certificados personalizados al completar los cursos que validan tus conocimientos adquiridos.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full text-indigo-600 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Soporte Personalizado</h3>
              <p className="text-gray-600">
                Contamos con un equipo de soporte dedicado para ayudarte en cada paso de tu aprendizaje.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Cómo Funciona</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Sigue estos sencillos pasos para comenzar tu capacitación profesional.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Regístrate</h3>
              <p className="text-gray-600">
                Crea una cuenta en nuestra plataforma para acceder a todos los cursos disponibles.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Realiza el Pago</h3>
              <p className="text-gray-600">
                Envía tu comprobante de pago junto con tu ID de usuario para desbloquear el acceso.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Accede al Contenido</h3>
              <p className="text-gray-600">
                Una vez verificado el pago, tendrás acceso completo a todos los módulos del curso.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white text-xl font-bold mb-4">
                4
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Obtén tu Certificado</h3>
              <p className="text-gray-600">
                Al completar el curso, recibirás un certificado personalizado que acredita tus conocimientos.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-10 flex items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Listo para comenzar?</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Regístrate ahora y comienza tu camino hacia el crecimiento profesional con nuestros cursos especializados.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Acceso a todos los cursos</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Certificados personalizados</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Soporte técnico incluido</span>
                    </div>
                  </div>
                  <div className="mt-8">
                    <Link
                      to="/register"
                      className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md text-lg font-medium shadow-md hover:bg-indigo-700 transition-colors"
                    >
                      Registrarse Ahora
                    </Link>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://media.licdn.com/dms/image/v2/C4E12AQGaOFypnM-fVA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1597700001587?e=2147483647&v=beta&t=_tHJn6n6F_OCGKT7ADKsKmn3LMniaDG7N8LmlV-zaBU" 
                  alt="Capacitación profesional" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;