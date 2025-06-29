import React, { useState, useEffect } from "react";
import { Home, User, Building2, ShoppingCart, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";

interface MobileBottomNavigationProps {
  className?: string;
}

export default function MobileBottomNavigation({
  className,
}: MobileBottomNavigationProps) {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const [isVisible, setIsVisible] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show/hide scroll to top button
      setShowScrollTop(currentScrollY > 400);

      // Show/hide bottom navigation based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide navigation
        setIsVisible(false);
      } else {
        // Scrolling up - show navigation
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const navigationItems = [
    {
      name: "Home",
      icon: Home,
      href: "#",
      active: true,
    },
    {
      name: "Account",
      icon: User,
      href: "#account",
      active: false,
    },
    {
      name: "Shop",
      icon: Building2,
      href: "#shop",
      active: false,
    },
    {
      name: "Cart",
      icon: ShoppingCart,
      href: "#cart",
      active: false,
    },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav
        className={cn(
          "md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 transition-transform duration-300",
          isVisible ? "translate-y-0" : "translate-y-full",
          className,
        )}
      >
        <div className="flex items-center justify-around px-4 py-2 safe-area-pb">
          {navigationItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <a
                key={index}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 min-w-[60px] transition-colors duration-200 relative",
                  item.active
                    ? "text-[#7C3AED]"
                    : "text-gray-600 hover:text-[#7C3AED]",
                )}
              >
                <div className="relative">
                  <IconComponent
                    className={cn(
                      "w-5 h-5 mb-1",
                    )}
                  />
                  {item.name === "Cart" && cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#DD3327] text-white text-[10px] w-[16px] h-[16px] rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium leading-tight">
                  {item.name}
                </span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={cn(
          "md:hidden fixed bottom-20 right-4 w-12 h-12 bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white rounded-full shadow-lg z-40 transition-all duration-300 flex items-center justify-center",
          showScrollTop
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-4 pointer-events-none",
        )}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>

      {/* Add bottom padding to prevent content from being hidden behind the nav */}
      <div className="md:hidden h-16" />
    </>
  );
}
