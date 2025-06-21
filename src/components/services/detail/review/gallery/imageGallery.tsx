import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import React, { useState } from 'react';

interface FullScreenImageViewerProps {
  images: string[];
  onClose: () => void;
  initialIndex?: number;
}

const FullScreenImageViewer: React.FC<FullScreenImageViewerProps> = ({
  images,
  onClose,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-white text-3xl hover:text-red-400 z-50"
        onClick={onClose}
      >
        <FaTimes />
      </button>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          onClick={prevImage}
          className="absolute left-4 text-white text-4xl hover:text-gray-300 z-50"
        >
          <FaChevronLeft />
        </button>
      )}

      {/* Image container */}
      <div className="w-full h-full flex items-center justify-center px-4">
        <LazyLoadImage
          src={images[currentIndex]}
          alt={`Imagen ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={nextImage}
          className="absolute right-4 text-white text-4xl hover:text-gray-300 z-50"
        >
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

export default FullScreenImageViewer;
