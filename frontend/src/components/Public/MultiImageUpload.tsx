import React, { useState, useRef, useEffect, MouseEvent, WheelEvent } from 'react';
import { ReactComponent as CloseIcon } from '@assets/icons/close.svg' 

type MultiImageUploadProps = {
  onImagesChange: (images: File[]) => void;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({ onImagesChange }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setImages(prev => [...prev, ...files]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
    onImagesChange(images);
  }, [images])

  const handleRemoveImage = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft ?? 0));
    setScrollLeft(scrollRef.current?.scrollLeft ?? 0);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    const walk = (x - startX) * 2; // 스크롤 속도 조절
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleWheel = (e: WheelEvent) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div 
      className="relative w-full h-[calc(6rem+14px)]"
    >    
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
        className={`flex gap-2 z-[0] w-full pb-[14px] overflow-x-auto cursor-grab`}
        style={{ 
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        }}
      >
        {previewUrls.map((url, index) => (
          <div 
            key={index} 
            className={`relative size-[6rem] flex-shrink-0`}
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
                cursor-pointer
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
            border-2 border-dashed cursor-pointer flex-shrink-0
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
    </div>
  );
};

export default MultiImageUpload;