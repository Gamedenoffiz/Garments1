import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { SearchIcon, UserIcon, CartIcon } from "./icons";

interface HeaderIconButtonProps {
  onClick?: () => void;
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
  badge?: number;
}

const HeaderIconButton: React.FC<HeaderIconButtonProps> = ({
  onClick,
  ariaLabel,
  className,
  children,
  badge,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "relative p-2 transition-all duration-200 hover:bg-gray-100 rounded-md",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {/* Badge */}
      {badge && badge > 0 && (
        <div className="absolute -top-1 -right-1 bg-[#DD3327] text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
          {badge > 99 ? "99+" : badge}
        </div>
      )}
    </button>
  );
};

// Search Icon Button
interface SearchButtonProps {
  onClick?: () => void;
  className?: string;
}

export const SearchButton: React.FC<SearchButtonProps> = ({
  onClick,
  className,
}) => (
  <HeaderIconButton
    onClick={onClick}
    ariaLabel="Search products"
    className={className}
  >
    <SearchIcon size="md" variant="secondary" />
  </HeaderIconButton>
);

// User Account Icon Button
interface UserButtonProps {
  onClick?: () => void;
  className?: string;
}

export const UserButton: React.FC<UserButtonProps> = ({
  onClick,
  className,
}) => (
  <HeaderIconButton
    onClick={onClick}
    ariaLabel="User account"
    className={className}
  >
    <UserIcon size="md" variant="secondary" />
  </HeaderIconButton>
);

// Cart Icon Button
interface CartButtonProps {
  onClick?: () => void;
  itemCount?: number;
  className?: string;
}

export const CartButton: React.FC<CartButtonProps> = ({
  onClick,
  itemCount = 0,
  className,
}) => (
  <HeaderIconButton
    onClick={onClick}
    ariaLabel={`Shopping cart with ${itemCount} items`}
    className={className}
    badge={itemCount}
  >
    <CartIcon
      size="md"
      variant={itemCount > 0 ? "secondary" : "secondary"}
      className={itemCount > 0 ? "fill-[#DD3327]" : ""}
    />
  </HeaderIconButton>
);

// Header Icons Group
interface HeaderIconsProps {
  onSearch?: () => void;
  onUserAccount?: () => void;
  onCart?: () => void;
  cartItemCount?: number;
  className?: string;
}

export const HeaderIcons: React.FC<HeaderIconsProps> = ({
  onSearch,
  onUserAccount,
  onCart,
  cartItemCount = 0,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <SearchButton onClick={onSearch} />
      <UserButton onClick={onUserAccount} />
      <CartButton onClick={onCart} itemCount={cartItemCount} />
    </div>
  );
};

// Search Bar Component (expandable)
interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  isOpen,
  onClose,
  onSearch,
  placeholder = "Search products...",
  className,
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50",
        className,
      )}
    >
      <div className="max-w-[1920px] mx-auto px-8 py-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <SearchIcon
              size="md"
              variant="secondary"
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ED1451] focus:border-transparent outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Close search"
            >
              ✕
            </button>
          </div>
          <button type="submit" className="sr-only">
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeaderIcons;
