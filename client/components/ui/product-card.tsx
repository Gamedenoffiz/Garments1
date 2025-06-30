import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { StarIcon } from "./icons";
import {
  AddToCartButton,
  ProductTitle,
  QuickViewButton,
} from "./enhanced-button";

interface ColorOption {
  name: string;
  color: string;
  isSelected?: boolean;
}

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  rating?: number;
  colors?: ColorOption[];
  onQuickView?: (id: number) => void;
  onAddToCart?: (id: number) => void;
  onColorSelect?: (id: number, colorIndex: number) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  rating,
  colors = [],
  onQuickView,
  onAddToCart,
  onColorSelect,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(
    colors.findIndex((color) => color.isSelected) || 0,
  );

  const handleColorSelect = (colorIndex: number) => {
    setSelectedColorIndex(colorIndex);
    onColorSelect?.(id, colorIndex);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        size="sm"
        variant="primary"
        className={cn(
          "w-[10px] h-[10px]",
          index < rating ? "fill-[#E91162]" : "fill-gray-300",
        )}
      />
    ));
  };

  const renderColorOptions = (colors: ColorOption[]) => {
    if (!colors.length) return null;

    return (
      <div className="flex gap-1 mt-2">
        {colors.slice(0, 5).map((color, index) => (
          <button
            key={index}
            onClick={() => handleColorSelect(index)}
            className={cn(
              "w-[20px] h-[20px] rounded-[5px] border-2 transition-all duration-200",
              "hover:scale-110",
              selectedColorIndex === index
                ? "border-[#888883] shadow-[0px_0px_0px_2px_#888883]"
                : "border-[#E8E8E1] shadow-[0px_0px_0px_1.5px_#E8E8E1]",
            )}
            style={{ backgroundColor: color.color }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          />
        ))}
        {colors.length > 5 && (
          <button
            className={cn(
              "w-[20px] h-[20px] rounded-[5px] border-[1.5px] border-[#E8E8E1]",
              "bg-white flex items-center justify-center",
              "text-[#4A4A4A] text-[15px] font-normal leading-normal",
              "hover:bg-[#f5f5f5] transition-colors duration-200",
            )}
            aria-label={`View ${colors.length - 5} more colors`}
          >
            +
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "group relative bg-white rounded-[5px] overflow-visible transition-all duration-300",
        "hover:shadow-lg",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative h-[615px] overflow-hidden rounded-[5px] bg-gray-100">
        <img
          src={image}
          alt={name}
          className={cn(
            "w-full h-full object-cover transition-transform duration-500",
            "group-hover:scale-105",
          )}
          loading="lazy"
        />

        {/* Quick View Button */}
        <div
          className={cn(
            "absolute top-4 right-4 transition-all duration-300 z-10",
            "opacity-100 scale-100", // Always visible now
          )}
        >
          <QuickViewButton
            showTooltip={isHovered}
            onClick={() => onQuickView?.(id)}
            aria-label={`Quick view ${name}`}
          />
        </div>

        {/* Add to Cart Button Overlay */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 p-4 transition-all duration-300",
            isHovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none",
          )}
        >
          <AddToCartButton
            variant={isHovered ? "hover" : "default"}
            onClick={() => onAddToCart?.(id)}
            className="w-full"
            aria-label={`Add ${name} to cart`}
          />
        </div>
      </div>

      {/* Product Information */}
      <div className="pt-4 pb-2">
        {/* Product Title */}
        <ProductTitle
          title={name}
          variant={isHovered ? "hover" : "default"}
          className="mb-1"
        />

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 py-[6px]">
            {renderStars(rating)}
          </div>
        )}

        {/* Price */}
        <div className="py-1">
          <span className="text-[#111] font-inter text-[14px] font-medium leading-[24.5px]">
            {price}
          </span>
        </div>

        {/* Color Options */}
        {colors.length > 0 && (
          <div className="pt-[2px]">{renderColorOptions(colors)}</div>
        )}
      </div>
    </div>
  );
};

// Product Grid Component for displaying multiple products
interface ProductGridProps {
  products: ProductCardProps[];
  onQuickView?: (id: number) => void;
  onAddToCart?: (id: number) => void;
  onColorSelect?: (id: number, colorIndex: number) => void;
  className?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onQuickView,
  onAddToCart,
  onColorSelect,
  className,
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5",
        className,
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onQuickView={onQuickView}
          onAddToCart={onAddToCart}
          onColorSelect={onColorSelect}
        />
      ))}
    </div>
  );
};

// Horizontal Scrolling Product Row (like in BestSelling)
interface ProductRowProps {
  products: ProductCardProps[];
  onQuickView?: (id: number) => void;
  onAddToCart?: (id: number) => void;
  onColorSelect?: (id: number, colorIndex: number) => void;
  className?: string;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  products,
  onQuickView,
  onAddToCart,
  onColorSelect,
  className,
}) => {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <div className="flex gap-5 min-w-max pb-4">
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[461px]">
            <ProductCard
              {...product}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
              onColorSelect={onColorSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
