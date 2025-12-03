import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import ScheduleTable from '../../components/shared/ScheduleTable';

/**
 * Gestión de aulas.
 * - Lista y creación de aulas.
 * - Permite seleccionar un aula y ver su horario de ocupación
 *   (cursos regulares + reservas de docentes) usando ScheduleTable.
 * Solo accesible por administrador.
 */
const RoomManagement = () => {
  const [form, setForm] = useState({ name: '', code: '', capacity: '' });
  const [creating, setCreating] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');

  // === React Query: listado de aulas ===
  const {
    data: rooms = [],
    isLoading: loadingRooms,
    error: errorRooms,
    refetch: refetchRooms,
    isFetching: isFetchingRooms,
  } = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await axiosClient.get('/rooms');
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  // Aula seleccionada por defecto: la primera de la lista
  useMemo(() => {
    if (!rooms.length) return;
    if (!selectedRoomId) {
      setSelectedRoomId(rooms[0]._id);
    }
  }, [rooms, selectedRoomId]);

  // === React Query: horario de la aula seleccionada ===
  const {
    data: roomSchedule = [],
    isLoading: loadingSchedule,
    error: errorSchedule,
  } = useQuery({
    queryKey: ['roomSchedule', selectedRoomId],
    queryFn: async () => {
      if (!selectedRoomId) return [];
      // Se espera que el backend entregue una lista de "blocks" ya unificados:
      // [{ day, startHour, duration, type, room, courseName, group, teacher, ... }]
      const res = await axiosClient.get(`/rooms/${selectedRoomId}/schedule`);
      // Soporta tanto res.data (array) como { blocks: [...] }
      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data.blocks)) return res.data.blocks;
      return [];
    },
    enabled: !!selectedRoomId,
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
      await axiosClient.post('/rooms', {
        ...form,
        capacity: Number(form.capacity) || 0,
      });
      setForm({ name: '', code: '', capacity: '' });
      await refetchRooms();
    } catch (err) {
      alert(err.response?.data?.message || 'Error al crear aula');
    } finally {
      setCreating(false);
    }
  };

  if (loadingRooms) return <p>Cargando aulas...</p>;
  if (errorRooms) return <p className="text-red-600">Error al cargar aulas.</p>;

  const selectedRoom =
    rooms.find((room) => room._id === selectedRoomId) || null;

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Gestión de aulas</h1>
        {isFetchingRooms && (
          <span className="text-xs text-gray-500">Actualizando aulas...</span>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Columna izquierda: creación y listado de aulas */}
        <div className="space-y-4 lg:col-span-1">
          {/* Formulario de creación */}
          <form
            onSubmit={handleCreate}
            className="space-y-4 bg-white p-4 shadow rounded"
          >
            <h2 className="text-lg font-semibold">Registrar nueva aula</h2>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Nombre o número (ej. 101, Lab Redes)"
                className="border p-2 rounded text-sm"
                required
              />
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleInputChange}
                placeholder="Código interno (opcional)"
                className="border p-2 rounded text-sm"
              />
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleInputChange}
                placeholder="Aforo (ej. 40)"
                className="border p-2 rounded text-sm"
                min="0"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {creating ? 'Creando...' : 'Crear aula'}
            </button>
          </form>

          {/* Listado de aulas */}
          <div className="bg-white p-4 shadow rounded">
            <h2 className="text-lg font-semibold mb-3">Aulas registradas</h2>
            {rooms.length === 0 ? (
              <p className="text-sm text-gray-500">
                No hay aulas registradas aún.
              </p>
            ) : (
              <ul className="space-y-2 max-h-[400px] overflow-y-auto">
                {rooms.map((room) => {
                  const isActive = room._id === selectedRoomId;
                  return (
                    <li
                      key={room._id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                        isActive
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedRoomId(room._id)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-gray-800">
                          {room.name || room.code}
                        </span>
                        <span className="text-xs text-gray-500">
                          {room.code && room.name ? `Código: ${room.code} · ` : ''}
                          Aforo: {room.capacity ?? 0}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Columna derecha: detalle y horario de aula */}
        <div className="space-y-4 lg:col-span-2">
          <div className="bg-white p-4 shadow rounded">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Horario de ocupación del aula
                </h2>
                {selectedRoom ? (
                  <p className="text-xs text-gray-500">
                    {selectedRoom.name || selectedRoom.code}{' '}
                    {selectedRoom.code && selectedRoom.name
                      ? `(${selectedRoom.code})`
                      : ''}
                    {typeof selectedRoom.capacity === 'number' &&
                      ` · Aforo: ${selectedRoom.capacity}`}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Selecciona un aula para ver su horario.
                  </p>
                )}
              </div>
            </div>

            {!selectedRoom ? (
              <p className="text-sm text-gray-500">
                No hay aula seleccionada.
              </p>
            ) : loadingSchedule ? (
              <p className="text-sm text-gray-500">
                Cargando horario de esta aula...
              </p>
            ) : errorSchedule ? (
              <p className="text-sm text-red-600">
                No se pudo cargar el horario de esta aula.
              </p>
            ) : roomSchedule.length === 0 ? (
              <p className="text-sm text-gray-500">
                Esta aula no tiene clases ni reservas registradas en el horario
                académico.
              </p>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-2">
                  Se muestran tanto clases regulares (teoría / laboratorio) como
                  reservas realizadas por docentes.
                </p>
                <ScheduleTable blocks={roomSchedule} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomManagement;
