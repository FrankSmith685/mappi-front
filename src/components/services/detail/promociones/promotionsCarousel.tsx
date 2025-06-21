/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaTimes,
} from "react-icons/fa";
import { imageBaseUrl } from "../../../../api/apiConfig";

interface PromotionsCarouselProps {
  promoIds: string[];
}

export const PromotionsCarousel = ({ promoIds }: PromotionsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);


  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? promoIds.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === promoIds.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Cerrar con ESC o navegar con teclas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullScreen) return;
      if (e.key === "Escape") setIsFullScreen(false);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen]);

  // Swipe en móviles
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (diff > 50) handlePrev();
    if (diff < -50) handleNext();
    touchStart.current = null;
  };

  // Autoplay effect
  useEffect(() => {
    if (isPaused || promoIds.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isPaused, promoIds]);

  useEffect(() => {
  if (currentIndex >= promoIds.length) {
    setCurrentIndex(0);
  }
}, [currentIndex, promoIds.length]);

  if (!promoIds || promoIds.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No hay promociones disponibles.
      </div>
    );
  }
  
  return (
    <div
      className={` ${
        isFullScreen
          ? "fixed !z-[300] inset-0 bg-black flex items-center justify-center p-6"
          : "px-6 pb-4"
      }`}
      ref={containerRef}
    >
      {!isFullScreen && (
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Promociones
        </h2>
      )}

      <div
        className={`relative rounded-2xl overflow-hidden border border-gray-200  shadow-lg ${
          isFullScreen ? "w-full h-full bg-gray-800" : "h-48 bg-gray-800"
        }`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <LazyLoadImage
          src={`${imageBaseUrl}serv_${promoIds[currentIndex]}`}
          alt={`Promoción ${promoIds[currentIndex]}`}
          className={`w-full h-full object-contain transition-transform duration-500 ${
            !isFullScreen ? "hover:scale-105" : ""
          }`}
        />

        {/* Expand / Close button */}
        <button
          onClick={toggleFullScreen}
          className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg z-10"
        >
          {isFullScreen ? <FaTimes /> : <FaExpand />}
        </button>

        {/* Navigation buttons */}
        {promoIds.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-3 rounded-full shadow-lg z-10"
            >
              <FaChevronLeft size={18} />
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-700 p-3 rounded-full shadow-lg z-10"
            >
              <FaChevronRight size={18} />
            </button>
          </>
        )}

        {/* Dots + index info */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 z-10">
          <div className="flex gap-2">
            {promoIds.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`w-3 h-3 rounded-full border border-white transition-all duration-300 ${
                  idx === currentIndex ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
          <span className="text-white text-xs mt-1">
            {currentIndex + 1} / {promoIds.length}
          </span>
        </div>
      </div>
    </div>
  );
};
