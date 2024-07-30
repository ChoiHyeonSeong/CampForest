import React, { useState, useRef } from 'react';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg' 

type MultiImageUploadProps = {
  onImagesChange: (images: File[]) => void;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({ onImagesChange }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setImages(prev => [...prev, ...files]);
    onImagesChange(files);
  };

  const handleRemoveImage = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-2">
      {previewUrls.map((url, index) => (
        <div key={index} className="relative w-24 h-24">
          <img src={url} alt={`preview ${index}`} className="w-full h-full object-cover" />
          <div
            onClick={() => handleRemoveImage(index)}
            className="absolute top-0 right-0 text-white w-5 h-5 flex items-center justify-center"
          >
            <CloseIcon stroke='#333333' fill='#FFFFFF'/>
          </div>
        </div>
      ))}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400"
      >
        +
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default MultiImageUpload;