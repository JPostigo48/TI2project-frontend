import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { ROLES, ROUTES } from '../utils/constants';

/**
 * Contexto de autenticación
 *
 * Esta implementación utiliza el servicio de autenticación para
 * iniciar/cerrar sesión y persiste la sesión en localStorage.  Si
 * `VITE_USE_MOCK_DATA` está en `true` usará los mocks provistos en
 * `src/mocks/auth.mock.js`.  Se expone el usuario autenticado, el
 * estado de autenticación y funciones para login y logout.
 */

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar sesión almacenada al montar
  useEffect(() => {
    const storedUser = AuthService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(AuthService.isAuthenticated());
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await AuthService.login(email, password);
      if (result?.success) {
        const { user: userData, token } = result;
        AuthService.saveSession(userData, token);
        setUser(userData);
        setIsAuthenticated(true);
        switch (userData.role) {
          case ROLES.STUDENT:
            navigate(ROUTES.STUDENT_DASHBOARD, { replace: true });
            break;
          case ROLES.TEACHER:
            navigate(ROUTES.TEACHER_DASHBOARD, { replace: true });
            break;
          case ROLES.ADMIN:
            navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
            break;
          case ROLES.SECRETARY:
            navigate(ROUTES.ADMIN_SEMESTERS, { replace: true });
            break;
          default:
            navigate(ROUTES.HOME, { replace: true });
        }
        return { success: true };
      }
      return { success: false, message: result?.message || 'Credenciales inválidas' };
    } catch (err) {
      return { success: false, message: err.message || 'Error al iniciar sesión' };
    }
  };

  /** Cerrar sesión y limpiar almacenamiento. */
  const logout = () => {
    AuthService.clearSession();
    setUser(null);
    setIsAuthenticated(false);
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/** Hook para consumir el contexto de autenticación */
export const useAuth = () => useContext(AuthContext);
