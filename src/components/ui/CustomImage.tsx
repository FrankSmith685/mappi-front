import { LazyLoadImage } from "react-lazy-load-image-component";
import { useImagePreloader } from "../../hooks/useImageHooks/useImagePreloader";
import { FaSpinner } from "react-icons/fa";

const CustomImage = ({ name, alt, width, height, className }: { name: string; alt: string; width?: number; height?: number; className?: string }) => {
  const { images, isLoaded } = useImagePreloader();
  const imageSrc = images[name] ?? "";
  if (!isLoaded) {
    return <div className="flex justify-center items-center w-full h-full">
    <FaSpinner className="animate-spin text-gray-500 text-3xl" />
  </div>
  }

  return <LazyLoadImage src={imageSrc} alt={alt} width={width} height={height} className={className} />;
};

export default CustomImage;