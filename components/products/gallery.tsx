"use client";

import { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0);

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="relative aspect-square bg-white rounded-lg overflow-hidden animate-fade-in-up">
        <TransformWrapper>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <TransformComponent>
                <img
                  key={activeImage}
                  src={images[activeImage]}
                  alt={`Product image ${activeImage + 1}`}
                  className="w-full h-full object-cover animate-fade-in-up"
                />
              </TransformComponent>

              <div className="absolute bottom-4 right-4 flex gap-2 animate-fade-in-up">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => zoomIn()}
                  className="bg-white/80 backdrop-blur-sm animate-fade-in-up"
                >
                  <ZoomIn className="h-4 w-4 animate-fade-in-up" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => zoomOut()}
                  className="bg-white/80 backdrop-blur-sm animate-fade-in-up"
                >
                  <ZoomOut className="h-4 w-4 animate-fade-in-up" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => resetTransform()}
                  className="bg-white/80 backdrop-blur-sm animate-fade-in-up"
                >
                  <RotateCw className="h-4 w-4 animate-fade-in-up" />
                </Button>
              </div>
            </>
          )}
        </TransformWrapper>

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 animate-fade-in-up"
          onClick={previousImage}
        >
          <ChevronLeft className="h-6 w-6 animate-fade-in-up" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 animate-fade-in-up"
          onClick={nextImage}
        >
          <ChevronRight className="h-6 w-6 animate-fade-in-up" />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 animate-fade-in-up">
        {images.map((image, index) => (
          <button
            key={index}
            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              index === activeImage
                ? "border-primary-orange"
                : "border-transparent hover:border-gray-300"
            }`}
            onClick={() => setActiveImage(index)}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover animate-fade-in-up"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
