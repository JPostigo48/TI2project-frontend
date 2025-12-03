import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminService from '../../services/admin.service';
import axiosClient from '../../api/axiosClient';

/**
 * Componente para la gestión de usuarios.
 * - Lista usuarios (React Query)
 * - Crea nuevos usuarios
 * - Activa/desactiva cuentas
 * - Resetea contraseñas
 * - Muestra un módulo de carga masiva deshabilitado (Excel)
 */
const UserManagement = () => {
  // Estado del formulario de creación
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    code: '',
  });
  const [creating, setCreating] = useState(false);

  // Filtro por rol
  const [roleFilter, setRoleFilter] = useState('all');

  // Carga de usuarios con React Query
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const res = await axiosClient.get('/users');
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await AdminService.createUser(form);
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'student',
        code: '',
      });
      await refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al crear usuario');
    } finally {
      setCreating(false);
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = prompt('Ingrese la nueva contraseña:');
    if (!newPassword) return;
    try {
      await AdminService.resetPassword(id, newPassword);
      alert('Contraseña actualizada');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al restablecer contraseña');
    }
  };

  const handleToggleActive = async (user) => {
    try {
      if (user.active) {
        await axiosClient.delete(`/users/${user._id}`);
      } else {
        await axiosClient.put(`/users/${user._id}`, { active: true });
      }
      await refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al actualizar usuario');
    }
  };

  // Lista filtrada por rol
  const filteredUsers = useMemo(() => {
    if (roleFilter === 'all') return users;
    return users.filter((u) => u.role === roleFilter);
  }, [users, roleFilter]);

  if (isLoading) return <p>Cargando usuarios...</p>;
  if (error) return <p className="text-red-600">Error al cargar usuarios.</p>;

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Gestión de usuarios</h1>
        {isFetching && (
          <span className="text-xs text-gray-500">
            Actualizando lista...
          </span>
        )}
      </div>

      {/* Formulario de creación */}
      <form onSubmit={handleCreate} className="space-y-4 bg-white p-4 shadow rounded">
        <h2 className="text-lg font-semibold">Crear nuevo usuario</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Nombre completo"
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            placeholder="Correo institucional"
            className="border p-2 rounded"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleInputChange}
            placeholder="Contraseña inicial"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleInputChange}
            placeholder="CUI/Código"
            className="border p-2 rounded"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="student">Alumno</option>
            <option value="teacher">Docente</option>
            <option value="secretary">Secretaría</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={creating}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {creating ? 'Creando...' : 'Crear usuario'}
        </button>
      </form>

      {/* Carga masiva de usuarios (deshabilitada por ahora) */}
      <div className="bg-gray-50 border border-dashed border-gray-300 p-4 rounded flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-400">
        <div className="mb-3 sm:mb-0">
          <h2 className="text-sm font-semibold">
            Carga masiva de usuarios (próximamente)
          </h2>
          <p className="text-xs">
            Podrás subir un archivo Excel para registrar varios usuarios a la vez.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".xlsx,.xls"
            disabled
            className="block text-xs text-gray-400 cursor-not-allowed"
          />
          <button
            type="button"
            disabled
            className="px-3 py-2 rounded bg-gray-200 text-gray-500 cursor-not-allowed text-xs sm:text-sm"
          >
            Subir Excel
          </button>
        </div>
      </div>

      {/* Listado de usuarios + filtro */}
      <div className="bg-white p-4 shadow rounded">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-lg font-semibold">Usuarios registrados</h2>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm text-gray-600">
              Filtrar por rol:
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 text-sm rounded px-2 py-1"
            >
              <option value="all">Todos</option>
              <option value="student">Alumnos</option>
              <option value="teacher">Docentes</option>
              <option value="secretary">Secretaría</option>
              <option value="admin">Administradores</option>
            </select>
            <span className="text-xs text-gray-500">
              Mostrando {filteredUsers.length} de {users.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Correo
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 py-2 whitespace-nowrap">{user.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{user.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap capitalize">
                    {user.role}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {user.active ? (
                      <span className="text-green-600">Activo</span>
                    ) : (
                      <span className="text-red-600">Inactivo</span>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {user.active ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      onClick={() => handleResetPassword(user._id)}
                      className="text-xs text-orange-600 hover:underline"
                    >
                      Resetear contraseña
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-center text-gray-500 text-sm"
                  >
                    No hay usuarios para el filtro seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
