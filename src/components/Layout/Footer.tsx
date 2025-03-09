import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Plataforma de Capacitación</h3>
            <p className="text-gray-400">Aprende a tu ritmo, desde cualquier lugar</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
            <a href="#" className="hover:text-indigo-400">Términos y Condiciones</a>
            <a href="#" className="hover:text-indigo-400">Política de Privacidad</a>
            <a href="#" className="hover:text-indigo-400">Contacto</a>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Plataforma de Capacitación. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;