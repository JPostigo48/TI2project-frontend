import React from 'react';
import { AlertTriangle } from 'lucide-react';

const Notice = ({ title, children, className = '' }) => {
  return (
    <div className={`card flex gap-3 items-start bg-yellow-50 border border-yellow-200 ${className}`}>
      <AlertTriangle className="mt-1 shrink-0 text-yellow-500" size={18} />
      <div className="text-sm text-gray-800">
        {title && <p className="font-semibold mb-1">{title}</p>}
        {children}
      </div>
    </div>
  );
};

export default Notice;
