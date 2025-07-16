"use client";

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
  imageClassName?: string;
  dataAiHint?: string;
}

export function ProductImageCarousel({ images, productName, imageClassName, dataAiHint }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={cn("aspect-square bg-muted rounded-lg flex items-center justify-center", imageClassName)}>
        <span className="text-muted-foreground">No Hay Imagen Disponible</span>
      </div>
    );
  }
  
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className={cn("relative aspect-square w-full overflow-hidden rounded-lg shadow-md", imageClassName)}>
        <Image
          src={images[currentIndex]}
          alt={`${productName} - Imagen ${currentIndex + 1}`}
          layout="fill"
          objectFit="contain"
          className="transition-opacity duration-300"
          data-ai-hint={dataAiHint || productName.toLowerCase().split(' ').slice(0,2).join(' ')}
        />
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 text-foreground rounded-full"
              onClick={handlePrev}
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 text-foreground rounded-full"
              onClick={handleNext}
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
             <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    currentIndex === index ? "bg-primary" : "bg-muted-foreground/50 hover:bg-muted-foreground"
                  )}
                  aria-label={`Ir a la imagen ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
