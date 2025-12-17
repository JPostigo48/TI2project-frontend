import React from 'react';

const NotFound = () => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-pink-50">
      <div className="text-center bg-white rounded-2xl shadow-xl p-12">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-gray-600 mb-6">Página no encontrada</p>
        <a
          href="/login"
          className="inline-block px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Volver
        </a>
      </div>
    </div>
  );
};

export default NotFound;

