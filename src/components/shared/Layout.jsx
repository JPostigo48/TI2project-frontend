import React from 'react';
import Navbar from './Navbar';

/**
 * Componente de layout general de la aplicación.
 * Envuelve el contenido de cada página con el navbar y un contenedor centrado.
 * Utiliza Tailwind CSS para el estilo responsivo.
 */
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
};

export default Layout;
