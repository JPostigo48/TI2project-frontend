import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { users } from '../mocks/auth.mock';
import { ROUTES } from '../utils/constants';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message);
      }
    } catch (err) {
      setError('Error inesperado al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (userEmail) => {
    setEmail(userEmail);
    setPassword('pass_test_123');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card del formulario */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo y título */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white">SA</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Sistema Académico</h1>
            <p className="text-gray-600 mt-2">Universidad Nacional de San Agustín</p>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="tu.correo@unsa.edu.pe"
                  required
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <button className="btn-secondary w-full mt-2" onClick={() => navigate(ROUTES.HOME)}>
            Volver al inicio
          </button>

          {/* Link de recuperación */}
          <div className="text-center mt-4">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        {/* Usuarios de prueba (solo en desarrollo) */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <p className="text-white text-sm font-semibold mb-3">🔐 Usuarios de prueba:</p>
          <div className="space-y-2">
            <button
              onClick={() => quickLogin(`${users[0].email}`)}
              className="w-full text-left px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors"
            >
              👨‍🎓 Alumno: {users[0].email} / pass_test_123
            </button>
            <button
              onClick={() => quickLogin(`${users[1].email}`)}
              className="w-full text-left px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors"
            >
              👨‍🏫 Docente: {users[1].email} / pass_test_123
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;