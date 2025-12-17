import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Calendar as CalendarIcon, Clock, CheckCircle, Users, AlertCircle, History, CalendarDays } from 'lucide-react';
import TeacherService from '../../services/teacher.service';
import LoadingSpinner from '../../components/shared/layout/LoadingSpinner';
import ErrorMessage from '../../components/shared/layout/ErrorMessage';
import { DAYS, ACADEMIC_HOURS } from '../../utils/constants';

const RoomReservation = () => {
  const qc = useQueryClient();
  
  // --- ESTADOS DEL FORMULARIO ---
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(''); 
  const [calculatedDay, setCalculatedDay] = useState(''); 
  const [selectedBlocks, setSelectedBlocks] = useState(new Set());
  const [reason, setReason] = useState('');

  // --- ESTADOS DEL HISTORIAL ---
  const [viewHistory, setViewHistory] = useState(false); // false = Futuras, true = Pasadas

  // 1. Cargar Aulas
  const { data: rooms = [], isLoading, error } = useQuery({
    queryKey: ['teacher-rooms'],
    queryFn: () => TeacherService.getRooms(),
  });

  // 2. Cargar Reservas (Depende del tab seleccionado)
  const { data: reservations = [], isLoading: loadingRes } = useQuery({
    queryKey: ['teacher-reservations', viewHistory],
    queryFn: () => TeacherService.getReservations(viewHistory),
  });

  // 3. Mutación
  const reserveMutation = useMutation({
    mutationFn: (payload) => TeacherService.reserveRoom(payload),
    onSuccess: () => {
      setSelectedBlocks(new Set());
      setReason('');
      setSelectedDate('');
      setCalculatedDay('');
      // Recargar la lista de reservas futuras
      qc.invalidateQueries(['teacher-reservations']);
    }
  });

  // ... (Funciones handleDateChange, handleToggleBlock igual que antes) ...
  const handleDateChange = (e) => {
    const dateVal = e.target.value;
    setSelectedDate(dateVal);
    setSelectedBlocks(new Set()); 

    if (dateVal) {
        const dateObj = new Date(dateVal + 'T00:00:00');
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[dateObj.getDay()];
        setCalculatedDay(dayName);
    } else {
        setCalculatedDay('');
    }
  };

  const handleToggleBlock = (blockNum) => {
    const newSet = new Set(selectedBlocks);
    if (newSet.has(blockNum)) {
        newSet.delete(blockNum);
    } else {
        newSet.add(blockNum);
    }
    setSelectedBlocks(newSet);
  };

  const handleSubmit = () => {
    if (!selectedRoom || !selectedDate || selectedBlocks.size === 0) return;
    
    reserveMutation.mutate({
        roomId: selectedRoom._id,
        day: calculatedDay,
        date: selectedDate,
        blocks: Array.from(selectedBlocks).sort((a,b) => a-b),
        reason
    });
  };

  if (isLoading) return <LoadingSpinner message="Cargando sistema de reservas..." />;
  if (error) return <ErrorMessage message="No se pudo cargar la información." />;

  return (
    <div className="space-y-10 animate-fade-in max-w-6xl mx-auto pb-12">
      
      {/* HEADER */}
      <div className="flex items-center gap-3">
         <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <MapPin size={24} />
         </div>
         <div>
            <h1 className="text-2xl font-bold text-gray-800">Reserva de Espacios</h1>
            <p className="text-gray-500 text-sm">Solicita aulas para clases extraordinarias o eventos.</p>
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO (Ocupa 7/12) */}
        <div className="lg:col-span-7 space-y-8">
            
            {/* PASO 1: SELECCIONAR AULA */}
            <section>
                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                    Selecciona un Ambiente
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {rooms.map(room => (
                        <div 
                            key={room._id || room.id}
                            onClick={() => setSelectedRoom(room)}
                            className={`cursor-pointer p-3 rounded-xl border-2 transition-all ${
                                selectedRoom?._id === room._id 
                                    ? 'border-blue-500 bg-blue-50 shadow-sm' 
                                    : 'border-gray-200 bg-white hover:border-blue-300'
                            }`}
                        >
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-gray-800 text-sm">{room.name}</h4>
                                {selectedRoom?._id === room._id && <CheckCircle className="text-blue-600" size={16} />}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Users size={12} /> Cap: {room.capacity} • {room.type === 'lab' ? 'Lab' : 'Aula'}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {selectedRoom && (
                <div className="animate-fade-in space-y-8">
                    {/* PASO 2 */}
                    <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                            Fecha y Horario
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fecha</label>
                                <input 
                                    type="date" 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                {calculatedDay && <div className="mt-1 text-xs text-blue-600 font-medium">{DAYS[calculatedDay]}</div>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Bloques (1-15)</label>
                                <div className={`grid grid-cols-5 gap-1 ${!selectedDate ? 'opacity-50 pointer-events-none' : ''}`}>
                                    {Array.from({ length: 15 }, (_, i) => i + 1).map(num => (
                                        <button
                                            key={num}
                                            onClick={() => handleToggleBlock(num)}
                                            className={`h-8 rounded text-xs font-medium transition-all ${
                                                selectedBlocks.has(num)
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* PASO 3 */}
                    <section className="bg-gray-50 p-5 rounded-xl border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                            Confirmar
                        </h3>
                        <div className="flex gap-3">
                            <input 
                                type="text" 
                                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                placeholder="Motivo (Ej: Examen...)"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                            <button
                                onClick={handleSubmit}
                                disabled={selectedBlocks.size === 0 || !selectedDate || reserveMutation.isLoading}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                {reserveMutation.isLoading ? '...' : 'Reservar'}
                            </button>
                        </div>
                        {/* Mensajes */}
                        {reserveMutation.isSuccess && (
                            <div className="mt-3 text-sm text-green-700 font-medium flex items-center gap-1">
                                <CheckCircle size={16}/> Reserva creada con éxito.
                            </div>
                        )}
                        {reserveMutation.isError && (
                            <div className="mt-3 text-sm text-red-600 font-medium flex items-center gap-1">
                                <AlertCircle size={16}/> {reserveMutation.error?.response?.data?.message || 'Error al reservar.'}
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>

        {/* COLUMNA DERECHA: HISTORIAL (Ocupa 5/12) */}
        <div className="lg:col-span-5">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <History size={18} className="text-blue-600"/> Mis Reservas
                    </h3>
                    <div className="flex bg-gray-200 rounded-lg p-1">
                        <button 
                            onClick={() => setViewHistory(false)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${!viewHistory ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                        >
                            Próximas
                        </button>
                        <button 
                            onClick={() => setViewHistory(true)}
                            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${viewHistory ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
                        >
                            Historial
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[600px] p-4 space-y-3">
                    {loadingRes ? (
                        <div className="py-10 text-center"><LoadingSpinner /></div>
                    ) : reservations.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 text-sm">
                            <CalendarDays size={32} className="mx-auto mb-2 opacity-20"/>
                            <p>No tienes reservas {viewHistory ? 'pasadas' : 'futuras'}.</p>
                        </div>
                    ) : (
                        reservations.map(res => (
                            <div key={res._id} className="p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors group bg-white shadow-sm">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-gray-800 text-sm">{res.room?.name}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${res.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {res.status === 'APPROVED' ? 'Aprobada' : res.status}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-600 flex items-center gap-2 mb-2">
                                    <CalendarIcon size={12} />
                                    {new Date(res.date).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'short' })}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {res.blocks.map(b => (
                                        <span key={b} className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded border border-gray-200">
                                            {b}°
                                        </span>
                                    ))}
                                </div>
                                {res.reason && (
                                    <div className="mt-2 text-xs text-gray-500 italic border-t border-gray-50 pt-1">
                                        "{res.reason}"
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default RoomReservation;