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
    <div className={`flex flex-wrap gap-2`}>
      {previewUrls.map((url, index) => (
        <div 
          key={index} 
          className={`relative size-[6rem]`}
        >
          <img 
            src={url} 
            alt={`preview ${index}`} 
            className={`
              w-full h-full 
              object-cover
            `}
          />
          <div
            onClick={() => handleRemoveImage(index)}
            className={`
              flex items-center justify-center absolute top-0 right-0 size-[1.25rem] 
              text-light-white
              dark:text-dark-white
            `}
          >
            <CloseIcon 
              stroke='#333333' 
              fill='#FFFFFF'
            />
          </div>
        </div>
      ))}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`
          flex items-center justify-center size-[6rem] 
          border-light-border-1 text-light-text-secondary
          dark:border-dark-border-1 dark:text-dark-text-secondary
          border-2 border-dashed
        `}
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