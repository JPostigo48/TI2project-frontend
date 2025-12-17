import React from 'react';

const bgByStatus = {
  idle: 'bg-gray-50 border-gray-300',
  editing: 'bg-blue-50/50 border-blue-200',
  success: 'bg-green-50/75 bg-opacity-20 border-green-200',
  error: 'bg-red-50/75 bg-opacity-20 border-red-200',
};

const StatusCard = ({
  status = 'idle',      // idle | editing | success | error
  dashed = false,      // borde punteado
  className = '',
  children,
}) => {
  const base =
    'border rounded p-3 ' +
    (dashed ? 'border-dashed ' : 'border-solid ');

  const statusClasses = bgByStatus[status] || bgByStatus.idle;

  return (
    <div className={`${base}${statusClasses} ${className}`}>
      {children}
    </div>
  );
};

export default StatusCard;
