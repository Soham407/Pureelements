
import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

const ImageWithFallback: React.FC<Props> = ({ fallbackText, className, ...props }) => {
  const [error, setError] = useState(false);

  // Reset error state when the src changes (e.g. inside a carousel)
  useEffect(() => {
    setError(false);
  }, [props.src]);

  if (error) {
    return (
      <div className={`bg-gray-100 flex flex-col items-center justify-center text-gray-400 ${className}`}>
        <ImageOff size={24} />
        {fallbackText && <span className="text-[10px] mt-2 uppercase tracking-wide">{fallbackText}</span>}
      </div>
    );
  }

  return (
    <img 
      {...props} 
      className={className} 
      onError={() => setError(true)} 
    />
  );
};

export default ImageWithFallback;
