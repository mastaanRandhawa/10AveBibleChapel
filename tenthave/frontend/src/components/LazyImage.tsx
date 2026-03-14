import React, { useState, useRef, useEffect } from "react";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * LazyImage component with intersection observer for performance optimization
 * Supports WebP format detection and fallback to original format
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "",
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PC9zdmc+",
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check if browser supports WebP
  const supportsWebP = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  };

  // Get optimized image source
  const getOptimizedSrc = (originalSrc: string) => {
    if (supportsWebP() && originalSrc.includes(".")) {
      const extension = originalSrc.split(".").pop();
      if (
        extension &&
        ["jpg", "jpeg", "png"].includes(extension.toLowerCase())
      ) {
        return originalSrc.replace(`.${extension}`, ".webp");
      }
    }
    return originalSrc;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const optimizedSrc = getOptimizedSrc(src);

  return (
    <div className={`lazy-image-container ${className}`} ref={imgRef}>
      {isInView && (
        <img
          src={hasError ? src : optimizedSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`lazy-image ${isLoaded ? "loaded" : "loading"}`}
          loading="lazy"
        />
      )}
      {!isLoaded && isInView && (
        <img
          src={placeholder}
          alt=""
          className="lazy-image placeholder"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default LazyImage;
