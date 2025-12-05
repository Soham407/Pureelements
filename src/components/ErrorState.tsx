import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = "Something went wrong", 
  message = "We encountered an error while loading this content. Please try again.", 
  onRetry,
  fullScreen = false
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${fullScreen ? 'min-h-[60vh]' : 'py-12'}`}>
      <div className="bg-red-50 p-4 rounded-full mb-4">
        <AlertCircle className="text-red-500" size={48} />
      </div>
      <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2 rounded-sm font-medium hover:bg-brand-dark transition-colors"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
