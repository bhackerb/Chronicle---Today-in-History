import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ message = "Loading...", fullScreen = false }) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 bg-historical-900/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm"
    : "flex flex-col items-center justify-center p-12";

  return (
    <div className={containerClasses}>
      <Loader2 className="w-12 h-12 text-accent-gold animate-spin mb-4" />
      <p className="text-historical-100 font-serif text-lg animate-pulse">{message}</p>
    </div>
  );
};

export default Loading;
