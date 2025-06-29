import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { CircularArrowButton } from "./enhanced-button";

interface CarouselNavProps {
  children: React.ReactNode[];
  className?: string;
  showArrows?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  itemsToShow?: number;
  gap?: number;
}

export const CarouselNav: React.FC<CarouselNavProps> = ({
  children,
  className,
  showArrows = true,
  showDots = true,
  autoPlay = false,
  autoPlayDelay = 5000,
  itemsToShow = 1,
  gap = 20,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const totalItems = children.length;
  const maxIndex = Math.max(0, totalItems - itemsToShow);

  useEffect(() => {
    if (!autoPlay || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, autoPlayDelay);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayDelay, isHovered, maxIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(Math.max(0, index), maxIndex));
  };

  return (
    <div
      className={cn("relative group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsToShow + gap / itemsToShow)}%)`,
            gap: `${gap}px`,
          }}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{
                width: `calc(${100 / itemsToShow}% - ${(gap * (itemsToShow - 1)) / itemsToShow}px)`,
              }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalItems > itemsToShow && (
        <>
          <div
            className={cn(
              "absolute left-4 top-1/2 transform -translate-y-1/2 z-10",
              "transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          >
            <CircularArrowButton
              direction="left"
              variant={isHovered ? "hover" : "default"}
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              aria-label="Previous slide"
            />
          </div>

          <div
            className={cn(
              "absolute right-4 top-1/2 transform -translate-y-1/2 z-10",
              "transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          >
            <CircularArrowButton
              direction="right"
              variant={isHovered ? "hover" : "default"}
              onClick={goToNext}
              disabled={currentIndex === maxIndex}
              aria-label="Next slide"
            />
          </div>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && totalItems > itemsToShow && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                currentIndex === index
                  ? "bg-[#ED1451] scale-125"
                  : "bg-gray-300 hover:bg-gray-400",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Product Carousel Component (specialized for products)
interface ProductCarouselProps {
  products: React.ReactNode[];
  className?: string;
  itemsToShow?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  className,
  itemsToShow = { mobile: 1, tablet: 2, desktop: 4 },
}) => {
  const [currentItemsToShow, setCurrentItemsToShow] = useState(
    itemsToShow.desktop,
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setCurrentItemsToShow(itemsToShow.mobile);
      } else if (width < 1024) {
        setCurrentItemsToShow(itemsToShow.tablet);
      } else {
        setCurrentItemsToShow(itemsToShow.desktop);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [itemsToShow]);

  return (
    <CarouselNav
      itemsToShow={currentItemsToShow}
      gap={20}
      className={className}
      showDots={false}
      autoPlay={false}
    >
      {products}
    </CarouselNav>
  );
};

// Hero Banner Carousel (for main banner)
interface HeroBannerCarouselProps {
  slides: React.ReactNode[];
  className?: string;
  autoPlay?: boolean;
  autoPlayDelay?: number;
}

export const HeroBannerCarousel: React.FC<HeroBannerCarouselProps> = ({
  slides,
  className,
  autoPlay = true,
  autoPlayDelay = 6000,
}) => {
  return (
    <CarouselNav
      itemsToShow={1}
      className={className}
      showArrows={true}
      showDots={true}
      autoPlay={autoPlay}
      autoPlayDelay={autoPlayDelay}
    >
      {slides}
    </CarouselNav>
  );
};

export default CarouselNav;
