import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <Loader2 className="animate-spin h-8 w-8 text-blue-600 mb-2" />
      {message && <p className="text-gray-600 text-sm text-center">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
