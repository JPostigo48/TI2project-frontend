import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import TeacherService from '../../services/teacher.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';

/**
 * Página para reservar ambientes/espacios para clases o eventos.
 * Lista los ambientes disponibles y permite seleccionar fecha y horario.
 */
const RoomReservation = () => {
  const {
    data: rooms = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['teacher-rooms'],
    queryFn: () => TeacherService.getRooms(),
  });

  const [roomId, setRoomId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const reserveMutation = useMutation({
    mutationFn: () => TeacherService.reserveRoom({ roomId, date, startTime, endTime }),
    onSuccess: () => {
      setRoomId('');
      setDate('');
      setStartTime('');
      setEndTime('');
    },
  });

  if (isLoading) return <LoadingSpinner message="Cargando ambientes..." />;
  if (error) return <ErrorMessage message={error.message || 'Error al cargar ambientes'} />;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId || !date || !startTime || !endTime) return;
    reserveMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Reserva de Ambientes</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Ambiente</label>
          <select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Seleccione un ambiente</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} (cap. {room.capacity})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Hora inicio</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Hora fin</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={reserveMutation.isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {reserveMutation.isLoading ? 'Reservando...' : 'Reservar'}
        </button>
        {reserveMutation.isSuccess && (
          <p className="text-green-600 mt-2">¡Reserva realizada con éxito!</p>
        )}
        {reserveMutation.isError && (
          <p className="text-red-600 mt-2">
            {reserveMutation.error?.message || 'Error al realizar la reserva'}
          </p>
        )}
      </form>
    </div>
  );
};

export default RoomReservation;
