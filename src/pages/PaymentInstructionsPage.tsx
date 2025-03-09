import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import { Copy, CheckCircle, AlertCircle } from 'lucide-react';

const PaymentInstructionsPage: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const [copied, setCopied] = React.useState(false);
  
  const copyUserId = () => {
    if (currentUser) {
      navigator.clipboard.writeText(currentUser.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-indigo-600 text-white">
            <h1 className="text-2xl font-bold">Instrucciones de Pago</h1>
            <p className="mt-2">Sigue estos pasos para obtener acceso completo a nuestros cursos.</p>
          </div>
          
          <div className="p-6">
            {userData?.hasAccess ? (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">¡Ya tienes acceso!</h3>
                  <p className="mt-1 text-sm text-green-700">
                    Tu pago ha sido verificado y ya tienes acceso completo a todos nuestros cursos.{' '}
                    <Link to="/courses" className="font-medium text-green-800 underline">
                      Ver mis cursos
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Acceso Pendiente</h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    Tu acceso será habilitado una vez que verifiquemos tu pago.
                  </p>
                </div>
              </div>
            )}
            
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pasos para realizar el pago:</h2>
            
            <ol className="space-y-6 mb-8">
              <li className="flex">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg mr-4">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Copia tu ID de usuario</h3>
                  <p className="mt-1 text-gray-600">
                    Este ID es necesario para identificar tu pago y habilitar tu acceso.
                  </p>
                  
                  {currentUser && (
                    <div className="mt-3 flex items-center">
                      <div className="flex-grow p-3 bg-gray-100 rounded-md font-mono text-sm overflow-x-auto">
                        {currentUser.uid}
                      </div>
                      <button 
                        onClick={copyUserId}
                        className="ml-3 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {copied ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </li>
              
              <li className="flex">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg mr-4">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Realiza la transferencia</h3>
                  <p className="mt-1 text-gray-600">
                    Realiza una transferencia bancaria con el monto correspondiente a la siguiente cuenta:
                  </p>
                  
                  <div className="mt-3 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700"><strong>Banco:</strong> Banco Nacional</p>
                    <p className="text-sm text-gray-700"><strong>Titular:</strong> Plataforma de Capacitación S.A.</p>
                    <p className="text-sm text-gray-700"><strong>Cuenta:</strong> 0123-4567-8901-2345</p>
                    <p className="text-sm text-gray-700"><strong>Monto:</strong> $99.99 USD</p>
                  </div>
                </div>
              </li>
              
              <li className="flex">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg mr-4">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Envía el comprobante</h3>
                  <p className="mt-1 text-gray-600">
                    Envía el comprobante de pago junto con tu ID de usuario al siguiente correo electrónico:
                  </p>
                  
                  <div className="mt-3 p-3 bg-gray-100 rounded-md font-medium text-indigo-600">
                    pagos@plataformacapacitacion.com
                  </div>
                </div>
              </li>
              
              <li className="flex">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-lg mr-4">
                  4
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Espera la confirmación</h3>
                  <p className="mt-1 text-gray-600">
                    Una vez verificado el pago, habilitaremos tu acceso a todos los cursos en un plazo máximo de 24 horas hábiles.
                  </p>
                </div>
              </li>
            </ol>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">¿Necesitas ayuda?</h3>
              <p className="text-gray-600">
                Si tienes alguna duda o problema con el proceso de pago, contáctanos a través de:
              </p>
              <p className="mt-2 text-indigo-600 font-medium">
                soporte@plataformacapacitacion.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentInstructionsPage;