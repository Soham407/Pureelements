import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  previewSize?: 'small' | 'medium' | 'large';
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Image',
  previewSize = 'medium',
  className = ''
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // Convert file to base64 data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onChange(result);
        setUploading(false);
      };
      reader.onerror = () => {
        alert('Failed to read image file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const previewSizes = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-gray-500 mb-1">{label}</label>
      )}
      
      <div className="flex items-start gap-3">
        {/* Preview */}
        {value ? (
          <div className="relative">
            <img 
              src={value} 
              alt="Preview" 
              className={`${previewSizes[previewSize]} object-cover rounded border border-gray-200`}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className={`${previewSizes[previewSize]} border-2 border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50`}>
            <ImageIcon size={20} className="text-gray-400" />
          </div>
        )}

        {/* Upload Button */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={16} />
            {uploading ? 'Uploading...' : value ? 'Change Image' : 'Upload Image'}
          </button>
        </div>
      </div>

      {/* URL Input (Alternative) */}
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or enter image URL"
          className="flex-1 p-2 border border-gray-300 rounded text-sm focus:border-brand-primary outline-none"
        />
        {value && (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-100 text-gray-500 rounded hover:bg-gray-200 transition-colors"
            title="Open image in new tab"
          >
            <ImageIcon size={16} />
          </a>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;

