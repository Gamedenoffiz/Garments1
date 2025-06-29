import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, ArrowLeftIcon } from "./icons";

// Shop Now Button Component
interface ShopNowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

export const ShopNowButton: React.FC<ShopNowButtonProps> = ({
  text = "Shop Now",
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        "group relative flex items-center gap-2 bg-transparent border-none p-0",
        "text-[#111] hover:text-[#555] transition-colors duration-200",
        "font-inter text-[14px] font-semibold leading-[26px]",
        className,
      )}
      {...props}
    >
      {/* Underline */}
      <div className="absolute bottom-0 left-0 w-[69px] h-[2px] bg-[#111]" />

      {/* Text */}
      <span className="relative">{text}</span>
    </button>
  );
};

// Add to Cart Button Component
interface AddToCartButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: "default" | "hover";
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  text = "Add to Cart",
  variant = "default",
  className,
  ...props
}) => {
  const isHover = variant === "hover";

  return (
    <button
      className={cn(
        "relative px-6 py-3 transition-colors duration-200",
        "font-inter text-[11px] font-semibold leading-[21px] uppercase",
        "border-none rounded-none",
        isHover
          ? "bg-[#111] text-white hover:bg-[#333]"
          : "bg-white text-[#111] border border-[#111] hover:bg-[#111] hover:text-white",
        className,
      )}
      {...props}
    >
      {text}
    </button>
  );
};

// Read More Button Component
interface ReadMoreButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  variant?: "primary" | "secondary";
}

export const ReadMoreButton: React.FC<ReadMoreButtonProps> = ({
  text = "Read more",
  variant = "primary",
  className,
  ...props
}) => {
  const isPrimary = variant === "primary";

  return (
    <button
      className={cn(
        "relative px-4 py-2 transition-colors duration-200",
        "font-inter text-center border-none rounded-none",
        isPrimary
          ? "text-[14px] font-semibold leading-[28px] uppercase text-white hover:text-[#555] bg-[#111] hover:bg-white"
          : "text-[17px] font-normal leading-[31px] text-[#ED1451] hover:text-white bg-transparent hover:bg-[#ED1451]",
        className,
      )}
      {...props}
    >
      {text}
    </button>
  );
};

// Circular Arrow Button Component (for carousels)
interface CircularArrowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction: "left" | "right";
  variant?: "default" | "hover";
  size?: "sm" | "md" | "lg";
}

export const CircularArrowButton: React.FC<CircularArrowButtonProps> = ({
  direction,
  variant = "default",
  size = "md",
  className,
  ...props
}) => {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  // Map button size to icon size
  const iconSizeMap = {
    sm: "sm", // 16px icon for small buttons
    md: "md", // 18px icon for medium buttons
    lg: "md", // 18px icon for large buttons
  };

  const isHover = variant === "hover";

  return (
    <button
      className={cn(
        "relative flex items-center justify-center rounded-full border transition-all duration-200",
        sizes[size],
        isHover
          ? "bg-[#111] border-[#111] text-white"
          : "bg-white border-[#EBEBEB] text-[#111] hover:bg-[#111] hover:border-[#111] hover:text-white",
        className,
      )}
      {...props}
    >
      {direction === "right" ? (
        <ArrowRightIcon
          size={iconSizeMap[size] as "sm" | "md" | "lg"}
          variant={isHover ? "white" : "black"}
          className="transition-colors duration-200"
        />
      ) : (
        <ArrowLeftIcon
          size={iconSizeMap[size] as "sm" | "md" | "lg"}
          variant={isHover ? "white" : "black"}
          className="transition-colors duration-200"
        />
      )}
    </button>
  );
};

// Quick View Button with Tooltip
interface QuickViewButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showTooltip?: boolean;
}

export const QuickViewButton: React.FC<QuickViewButtonProps> = ({
  showTooltip = false,
  className,
  ...props
}) => {
  return (
    <div className="relative group">
      <button
        className={cn(
          "flex items-center justify-center w-[45px] h-[45px] rounded-full",
          "bg-white border border-[#EBEBEB] transition-all duration-200",
          "hover:bg-[#111] hover:border-[#111]",
          className,
        )}
        {...props}
      >
        <svg
          viewBox="0 0 15 13"
          className="w-[14px] h-[12px] fill-[#111] group-hover:fill-white transition-colors duration-200"
        >
          <path d="M0.568359 6.82226C0.522786 6.9043 0.5 6.99088 0.5 7.08203C0.5 7.17318 0.522786 7.25976 0.568359 7.3418C0.568359 7.3418 0.623047 7.44661 0.732422 7.65625C0.841797 7.85677 1.0013 8.11198 1.21094 8.42187C1.34766 8.61328 1.49805 8.82291 1.66211 9.05078C1.83529 9.26953 2.02669 9.49284 2.23633 9.7207C2.50065 10.0033 2.79232 10.2858 3.11133 10.5684C3.43945 10.8509 3.79492 11.1107 4.17773 11.3476C4.64258 11.6393 5.15299 11.8763 5.70898 12.0586C6.26497 12.2409 6.86198 12.332 7.5 12.332C8.13802 12.332 8.73503 12.2409 9.29102 12.0586C9.84701 11.8763 10.3574 11.6393 10.8223 11.3476C11.2051 11.1107 11.556 10.8509 11.875 10.5684C12.2031 10.2858 12.4993 10.0033 12.7637 9.7207C12.9733 9.49284 13.1602 9.26953 13.3242 9.05078C13.4974 8.82291 13.6523 8.61328 13.7891 8.42187C13.9987 8.11198 14.1582 7.85677 14.2676 7.65625C14.377 7.44661 14.4316 7.3418 14.4316 7.3418C14.4772 7.26888 14.5 7.18685 14.5 7.0957C14.5 7.00456 14.4772 6.91341 14.4316 6.82226C14.4316 6.82226 14.377 6.722 14.2676 6.52148C14.1582 6.31185 13.9987 6.05664 13.7891 5.75586C13.6523 5.56445 13.4974 5.35937 13.3242 5.14062C13.1602 4.91276 12.9733 4.68489 12.7637 4.45703C12.4993 4.17448 12.2031 3.89193 11.875 3.60937C11.556 3.32682 11.2051 3.06706 10.8223 2.83008C10.3574 2.53841 9.84701 2.30143 9.29102 2.11914C8.73503 1.92773 8.13802 1.83203 7.5 1.83203C6.86198 1.83203 6.26497 1.92773 5.70898 2.11914C5.15299 2.30143 4.64258 2.53841 4.17773 2.83008C3.79492 3.06706 3.43945 3.32682 3.11133 3.60937C2.79232 3.89193 2.50065 4.17448 2.23633 4.45703C2.02669 4.68489 1.83529 4.91276 1.66211 5.14062C1.49805 5.35937 1.34766 5.56445 1.21094 5.75586C1.0013 6.05664 0.841797 6.31185 0.732422 6.52148C0.623047 6.722 0.568359 6.82226 0.568359 6.82226ZM1.74414 7.08203C1.79883 7 1.85807 6.9043 1.92188 6.79492C1.99479 6.67643 2.08138 6.54883 2.18164 6.41211C2.30013 6.23893 2.43685 6.05208 2.5918 5.85156C2.74674 5.65104 2.91536 5.45052 3.09766 5.25C3.33464 4.98568 3.5944 4.73047 3.87695 4.48437C4.15951 4.23828 4.46484 4.01497 4.79297 3.81445C5.1849 3.56836 5.60417 3.37239 6.05078 3.22656C6.50651 3.08073 6.98958 3.00781 7.5 3.00781C8.01042 3.00781 8.48893 3.08073 8.93555 3.22656C9.39128 3.37239 9.8151 3.56836 10.207 3.81445C10.5352 4.01497 10.8405 4.23828 11.123 4.48437C11.4056 4.73047 11.6654 4.98568 11.9023 5.25C12.0846 5.45052 12.2533 5.65104 12.4082 5.85156C12.5632 6.05208 12.6999 6.23893 12.8184 6.41211C12.9186 6.54883 13.0007 6.67643 13.0645 6.79492C13.1374 6.9043 13.2012 7 13.2559 7.08203C13.2012 7.16406 13.1374 7.26432 13.0645 7.38281C13.0007 7.49219 12.9186 7.61979 12.8184 7.76562C12.6999 7.9388 12.5632 8.12565 12.4082 8.32617C12.2533 8.52669 12.0846 8.72721 11.9023 8.92773C11.6654 9.18294 11.4056 9.43359 11.123 9.67969C10.8405 9.92578 10.5352 10.1536 10.207 10.3633C9.8151 10.6003 9.39128 10.7962 8.93555 10.9511C8.48893 11.097 8.01042 11.1699 7.5 11.1699C6.98958 11.1699 6.50651 11.097 6.05078 10.9511C5.60417 10.7962 5.1849 10.6003 4.79297 10.3633C4.46484 10.1536 4.15951 9.92578 3.87695 9.67969C3.5944 9.43359 3.33464 9.18294 3.09766 8.92773C2.91536 8.72721 2.74674 8.52669 2.5918 8.32617C2.43685 8.12565 2.30013 7.9388 2.18164 7.76562C2.08138 7.61979 1.99479 7.49219 1.92188 7.38281C1.85807 7.26432 1.79883 7.16406 1.74414 7.08203ZM9.83789 7.08203C9.83789 6.76302 9.77409 6.46224 9.64648 6.17969C9.52799 5.89713 9.36393 5.65104 9.1543 5.4414C8.94466 5.23177 8.69401 5.06771 8.40234 4.94922C8.11979 4.82161 7.81901 4.75781 7.5 4.75781C7.18099 4.75781 6.87565 4.82161 6.58398 4.94922C6.30143 5.06771 6.05534 5.23177 5.8457 5.4414C5.63607 5.65104 5.46745 5.89713 5.33984 6.17969C5.22135 6.46224 5.16211 6.76302 5.16211 7.08203C5.16211 7.41015 5.22135 7.71549 5.33984 7.99804C5.46745 8.2806 5.63607 8.52669 5.8457 8.73633C6.05534 8.94596 6.30143 9.11458 6.58398 9.24219C6.87565 9.36068 7.18099 9.41992 7.5 9.41992C7.81901 9.41992 8.11979 9.36068 8.40234 9.24219C8.69401 9.11458 8.94466 8.94596 9.1543 8.73633C9.36393 8.52669 9.52799 8.2806 9.64648 7.99804C9.77409 7.71549 9.83789 7.41015 9.83789 7.08203ZM8.66211 7.08203C8.66211 7.24609 8.63021 7.40104 8.56641 7.54687C8.51172 7.68359 8.42969 7.80664 8.32031 7.91601C8.22005 8.01627 8.09701 8.09831 7.95117 8.16211C7.81445 8.22591 7.66406 8.25781 7.5 8.25781C7.33594 8.25781 7.18099 8.22591 7.03516 8.16211C6.89844 8.09831 6.77995 8.01627 6.67969 7.91601C6.57031 7.80664 6.48372 7.68359 6.41992 7.54687C6.36523 7.40104 6.33789 7.24609 6.33789 7.08203C6.33789 6.92708 6.36523 6.78125 6.41992 6.64453C6.48372 6.4987 6.57031 6.37109 6.67969 6.26172C6.77995 6.15234 6.89844 6.07031 7.03516 6.01562C7.18099 5.95182 7.33594 5.91992 7.5 5.91992C7.66406 5.91992 7.81445 5.95182 7.95117 6.01562C8.09701 6.07031 8.22005 6.15234 8.32031 6.26172C8.42969 6.37109 8.51172 6.4987 8.56641 6.64453C8.63021 6.78125 8.66211 6.92708 8.66211 7.08203Z" />
        </svg>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute left-[-102px] top-[9px] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-[#111] text-white text-[12px] font-normal leading-[13px] px-3 py-2 rounded-[3px] whitespace-nowrap">
            Quick view
            {/* Arrow */}
            <div className="absolute right-[-5px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-[5px] border-l-[#111] border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent" />
          </div>
        </div>
      )}
    </div>
  );
};

// Product Title Component with hover states
interface ProductTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  variant?: "default" | "hover" | "large";
}

export const ProductTitle: React.FC<ProductTitleProps> = ({
  title,
  variant = "default",
  className,
  ...props
}) => {
  const variants = {
    default: "text-[#111] hover:text-[#555]",
    hover: "text-[#555]",
    large: "text-[#111] font-medium leading-[26px]",
  };

  return (
    <div
      className={cn(
        "transition-colors duration-200 cursor-pointer",
        "font-jost text-[15px] font-normal leading-[19.5px] capitalize",
        "w-[250px] h-[20px] flex flex-col justify-center",
        variants[variant],
        className,
      )}
      {...props}
    >
      {title}
    </div>
  );
};
