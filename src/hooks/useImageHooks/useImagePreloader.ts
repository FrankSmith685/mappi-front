import { useEffect, useRef, useState } from "react";
import { imageList } from "../../utils/imageUtils";
import { imageBaseUrl } from "../../api/apiConfig";

interface ImagePreloaderState {
  images: Record<string, string>;
  isLoaded: boolean;
}

export const useImagePreloader = (): ImagePreloaderState => {
  const images = useRef<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadImages = async () => {
      const promises = imageList.map(({ name, key }) => {
        return new Promise<void>((resolve) => {
          if (images.current[name]) {
            resolve();
            return;
          }

          const img = new Image();
          img.src = `${imageBaseUrl}${key}`;
          img.onload = () => {
            images.current[name] = img.src;
            resolve();
          };
          img.onerror = () => {
            console.error(`Error al cargar la imagen: ${img.src}`);
            resolve();
          };
        });
      });

      await Promise.all(promises);
      if (isMounted) setIsLoaded(true);
    };

    loadImages();
    return () => {
      isMounted = false;
    };
  }, []);

  return { images: images.current, isLoaded };
};
