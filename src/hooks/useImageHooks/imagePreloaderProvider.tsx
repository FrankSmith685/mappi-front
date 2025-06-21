/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode } from "react";
import { useImagePreloader } from "./useImagePreloader";

interface ImagePreloaderContextType {
  images: Record<string, string>;
  isLoaded: boolean;
}

export const ImagePreloaderContext = createContext<ImagePreloaderContextType | null>(null);

export const ImagePreloaderProvider = ({ children }: { children: ReactNode }) => {
  const { images, isLoaded } = useImagePreloader();

  return (
    <ImagePreloaderContext.Provider value={{ images, isLoaded }}>
      {children}
    </ImagePreloaderContext.Provider>
  );
};
