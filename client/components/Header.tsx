import { Search, User, ShoppingCart, Menu, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useCart } from "@/hooks/useCart";
import LoginPage from "../pages/LoginPage";

interface HeaderProps {
  cartItemsCount?: number;
  cartCount?: number;
  onCartClick?: () => void;
  onCartToggle?: () => void;
}

export default function Header({
  cartItemsCount = 0,
  cartCount = 0,
  onCartClick,
  onCartToggle,
}: HeaderProps) {
  const { user, signOut, loading } = useAuth();
  const { isAdmin, adminUser } = useAdmin();
  const { cartItems } = useCart();
  
  // Calculate cart count from database cart items or fallback to props
  const dbCartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalCartCount = dbCartCount || cartItemsCount || cartCount;
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Smooth dropdown functions with delays
  const handleDropdownEnter = (itemName: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setActiveDropdown(itemName);
  };

  const handleDropdownLeave = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 500); // 500ms delay for leave - gives time to move to dropdown
    setDropdownTimeout(timeout);
  };

  const handleDropdownContentEnter = (itemName: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setActiveDropdown(itemName);
  };

  const handleDropdownContentLeave = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
    }
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 200); // Shorter delay when leaving dropdown content
    setDropdownTimeout(timeout);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      alert(`Searching for: ${searchQuery}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserDropdown(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navigationItems = [
    {
      name: "Men",
      hasDropdown: true,
      items: [
        {
          name: "T-Shirts",
          hasSubItems: true,
          subItems: [
            "Round Neck T-Shirts",
            "V-Neck T-Shirts", 
            "Polo T-Shirts",
            "Long Sleeve T-Shirts",
            "Sleeveless T-Shirts",
            "Full Hand T-Shirts"
          ]
        },
        {
          name: "Bottom Wear",
          hasSubItems: true,
          subItems: [
            "Track Pants",
            "Shorts"
          ]
        }
      ],
    },
    {
      name: "Women",
      hasDropdown: true,
      items: [
        {
          name: "Leggings",
          hasSubItems: true,
          subItems: [
            "Flat Ankle Leggings",
            "Flat Full Length Leggings",
            "Churidhar Ankle Leggings",
            "Churidhar Full Length Leggings",
            "Shimmer Leggings",
            "3/4 Leggings"
          ]
        },
        {
          name: "Saree Shapewear",
          hasSubItems: true,
          subItems: [
            "Lycra Cotton Shapewear",
            "Polyester Shapewear",
            "Shimmer Shapewear"
          ]
        },
        {
          name: "Night Wear",
          hasSubItems: true,
          subItems: [
            "Night T-Shirts"
          ]
        },
        {
          name: "Inner Wear",
          hasSubItems: true,
          subItems: [
            "Shorts",
            "Basic Slips", 
            "Adjustment Slips",
            "Panties"
          ]
        }
      ],
    },
    {
      name: "Shop All",
      hasDropdown: false,
      link: "/all-products",
    },
    {
      name: "Hot Sales",
      hasDropdown: false,
      isNew: true,
      link: "/hot-sales",
    },
    { 
      name: "About", 
      hasDropdown: false,
      link: "/about",
    },
  ];

  return (
    <header className="bg-white w-full border-b border-gray-100">
      <div className="max-w-[1320px] mx-auto px-[30px] py-3">
        <div className="flex items-center">
          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:text-[#7C3AED] transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 md:flex-none">
            <Link to="/" className="flex items-center">
              <div className="flex items-center gap-2">
                {/* Placeholder logo - replace with your logo when ready */}
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">FS</span>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    FashionStore
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">Premium Fashion</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center flex-1 justify-center">
            <ul className="flex items-center justify-center">
              {navigationItems.map((item, index) => (
                <li
                  key={index}
                  className="relative group"
                  onMouseEnter={() =>
                    item.hasDropdown && handleDropdownEnter(item.name)
                  }
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    to={item.link || (item.hasDropdown ? `/category/${item.name.toLowerCase()}` : `/products/${item.name.toLowerCase()}`)}
                    className="flex items-center px-[20px] py-[9.5px] text-[#111] font-medium text-[15px] leading-[26.25px] hover:text-[#7C3AED] transition-all duration-300 ease-in-out font-jost"
                  >
                    <span className="relative">
                      {item.name}
                      {item.isNew && (
                        <span className="absolute -top-[3px] left-[calc(100%+6px)] bg-[#516CF4] text-white text-[9px] font-semibold px-[6px] py-[3px] rounded-[2px] uppercase leading-[9px]">
                          New
                        </span>
                      )}
                    </span>
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`ml-[6px] w-[14px] h-[14px] opacity-50 transition-transform duration-500 ease-in-out ${
                          activeDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.hasDropdown &&
                    item.items &&
                    activeDropdown === item.name && (
                      <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2 animate-in fade-in-0 zoom-in-95 duration-300 ease-out"
                           onMouseEnter={() => handleDropdownContentEnter(item.name)}
                           onMouseLeave={handleDropdownContentLeave}
                      >
                        {item.items.map((mainCategory: any, mainIndex: number) => {
                          // Create URL for category pages
                          const getCategoryUrl = (categoryName: string, parentCategory?: string) => {
                            let categorySlug = categoryName.toLowerCase()
                              .replace(/\//g, '-') // Replace forward slashes with hyphens (for "3/4 Leggings" -> "3-4-leggings")
                              .replace(/[^a-z0-9\s-]/g, '') // Remove special characters but keep hyphens and spaces
                              .replace(/\s+/g, '-') // Replace spaces with dashes
                              .replace(/--+/g, '-') // Replace multiple consecutive dashes with single dash
                              .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
                            
                            // Handle specific routing for shorts to differentiate men's and women's
                            if (categorySlug === 'shorts') {
                              if (parentCategory === 'Bottom Wear' || item.name === 'Men') {
                                return `/category/shorts`; // Men's shorts
                              } else if (parentCategory === 'Inner Wear' || item.name === 'Women') {
                                return `/category/women-shorts`; // Women's inner wear shorts
                              }
                            }
                            
                            return `/category/${categorySlug}`;
                          };
                          
                          return (
                            <div key={mainIndex} className="mb-3 last:mb-0">
                              {/* Main Category */}
                              <Link
                                to={getCategoryUrl(mainCategory.name, mainCategory.name)}
                                className="block px-4 py-2 text-[15px] font-semibold text-[#7C3AED] hover:bg-gray-50 transition-all duration-200 ease-in-out"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {mainCategory.name}
                              </Link>
                              
                              {/* Sub Categories */}
                              {mainCategory.hasSubItems && mainCategory.subItems && (
                                <div className="ml-4 border-l-2 border-gray-100 pl-2">
                                  {mainCategory.subItems.map((subItem: string, subIndex: number) => (
                                    <Link
                                      key={subIndex}
                                      to={getCategoryUrl(subItem, mainCategory.name)}
                                      className="block px-3 py-1.5 text-[13px] text-[#666] hover:text-[#7C3AED] hover:bg-gray-50 transition-all duration-200 ease-in-out transform hover:translate-x-1"
                                      onClick={() => setActiveDropdown(null)}
                                    >
                                      {subItem}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center justify-end flex-1 md:flex-none">
            <div className="flex items-center space-x-[20px]">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-[5px] hover:text-[#7C3AED] transition-colors"
              >
                <Search className="w-[17px] h-[17px]" />
              </button>
              
              {/* User Account Button */}
              <div className="relative" ref={userDropdownRef}>
                {user ? (
                  <div className="relative">
                    <button 
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="p-[5px] hover:text-[#7C3AED] transition-colors flex items-center space-x-2"
                    >
                      <User className="w-[17px] h-[17px]" />
                      <span className="hidden md:block text-sm text-gray-700">
                        {user.user_metadata?.first_name || user.email?.split('@')[0]}
                      </span>
                      <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* User Dropdown */}
                    {showUserDropdown && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user.user_metadata?.first_name && user.user_metadata?.last_name 
                              ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                              : user.email
                            }
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          {isAdmin && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs bg-[#7C3AED] text-white rounded-full">
                              {adminUser?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                            </span>
                          )}
                        </div>

                        {/* Admin Product Management Section */}
                        {isAdmin && (
                          <>
                            <div className="px-4 py-2 border-b border-gray-100">
                              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Product Management
                              </p>
                              <div className="space-y-1">
                                <Link
                                  to="/admin"
                                  className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7C3AED] transition-colors rounded"
                                  onClick={() => setShowUserDropdown(false)}
                                >
                                  Dashboard
                                </Link>
                                <Link
                                  to="/admin?tab=products"
                                  className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7C3AED] transition-colors rounded"
                                  onClick={() => setShowUserDropdown(false)}
                                >
                                  All Products
                                </Link>
                                <Link
                                  to="/admin?tab=products&action=add"
                                  className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7C3AED] transition-colors rounded"
                                  onClick={() => setShowUserDropdown(false)}
                                >
                                  Add Product
                                </Link>
                                <Link
                                  to="/admin?tab=categories"
                                  className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7C3AED] transition-colors rounded"
                                  onClick={() => setShowUserDropdown(false)}
                                >
                                  Categories
                                </Link>
                                <Link
                                  to="/admin?tab=orders"
                                  className="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7C3AED] transition-colors rounded"
                                  onClick={() => setShowUserDropdown(false)}
                                >
                                  Orders
                                </Link>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Regular User Options */}
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7C3AED] transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#7C3AED] transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={handleSignOut}
                          disabled={loading}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {loading ? "Signing out..." : "Sign Out"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsLoginModalOpen(true)}
                    className="p-[5px] hover:text-[#7C3AED] transition-colors"
                  >
                    <User className="w-[17px] h-[17px]" />
                  </button>
                )}
              </div>
              
              <div className="pl-[10px]">
                <Link
                  to="/cart"
                  onClick={onCartClick || onCartToggle}
                  className="p-[3px] hover:text-[#7C3AED] transition-colors relative block"
                >
                  <ShoppingCart className="w-[21px] h-[17px]" />
                  {totalCartCount > 0 && (
                    <div className="absolute -top-[6px] -right-[10px] bg-[#DD3327] text-white text-[10px] w-[18px] h-[18px] rounded-[9px] flex items-center justify-center leading-[10px]">
                      {totalCartCount}
                    </div>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white border-t border-gray-200 z-50">
            <nav className="px-4 py-2">
              <ul className="space-y-1">
                {navigationItems.map((item, index) => (
                  <li key={index}>
                    <div>
                      {item.hasDropdown ? (
                        <button
                          className="flex items-center justify-between w-full py-3 text-[#111] font-medium text-[15px] hover:text-[#7C3AED] transition-colors border-b border-gray-100"
                          onClick={() => {
                            setActiveDropdown(
                              activeDropdown === item.name ? null : item.name,
                            );
                          }}
                        >
                          <span className="relative">
                            {item.name}
                            {item.isNew && (
                              <span className="ml-2 bg-[#516CF4] text-white text-[9px] font-semibold px-2 py-1 rounded-sm uppercase">
                                New
                              </span>
                            )}
                          </span>
                          <svg
                            className={`w-4 h-4 opacity-50 transition-transform duration-200 ${
                              activeDropdown === item.name ? "rotate-90" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      ) : (
                        <Link
                          to={item.link || `/products/${item.name.toLowerCase()}`}
                          className="flex items-center justify-between w-full py-3 text-[#111] font-medium text-[15px] hover:text-[#7C3AED] transition-colors border-b border-gray-100"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span className="relative">
                            {item.name}
                            {item.isNew && (
                              <span className="ml-2 bg-[#516CF4] text-white text-[9px] font-semibold px-2 py-1 rounded-sm uppercase">
                                New
                              </span>
                            )}
                          </span>
                        </Link>
                      )}

                      {/* Mobile Submenu */}
                      {item.hasDropdown &&
                        item.items &&
                        activeDropdown === item.name && (
                          <div className="pl-4 py-2 bg-gray-50">
                            {item.items.map((mainCategory: any, mainIndex: number) => {
                              const getCategoryUrl = (categoryName: string, parentCategory?: string) => {
                                let categorySlug = categoryName.toLowerCase()
                                  .replace(/\//g, '-') // Replace forward slashes with hyphens (for "3/4 Leggings" -> "3-4-leggings")
                                  .replace(/[^a-z0-9\s-]/g, '') // Remove special characters but keep hyphens and spaces
                                  .replace(/\s+/g, '-') // Replace spaces with dashes
                                  .replace(/--+/g, '-') // Replace multiple consecutive dashes with single dash
                                  .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
                                
                                // Handle specific routing for shorts to differentiate men's and women's
                                if (categorySlug === 'shorts') {
                                  if (parentCategory === 'Bottom Wear' || item.name === 'Men') {
                                    return `/category/shorts`; // Men's shorts
                                  } else if (parentCategory === 'Inner Wear' || item.name === 'Women') {
                                    return `/category/women-shorts`; // Women's inner wear shorts
                                  }
                                }
                                
                                return `/category/${categorySlug}`;
                              };
                              
                              return (
                                <div key={mainIndex} className="mb-2">
                                  {/* Main Category */}
                                  <Link
                                    to={getCategoryUrl(mainCategory.name, mainCategory.name)}
                                    className="block py-2 text-[14px] font-semibold text-[#7C3AED] hover:text-[#5B21B6] transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {mainCategory.name}
                                  </Link>
                                  
                                  {/* Sub Categories */}
                                  {mainCategory.hasSubItems && mainCategory.subItems && (
                                    <div className="ml-3 border-l-2 border-gray-200 pl-2">
                                      {mainCategory.subItems.map((subItem: string, subIndex: number) => (
                                        <Link
                                          key={subIndex}
                                          to={getCategoryUrl(subItem, mainCategory.name)}
                                          className="block py-1.5 text-[12px] text-[#666] hover:text-[#7C3AED] transition-colors"
                                          onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                          {subItem}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "t-shirts",
                    "leggings", 
                    "track pants",
                    "shapewear",
                    "night wear",
                    "shorts"
                  ].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term);
                        handleSearch(new Event("submit") as any);
                      }}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginPage
          isModal={true}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}
    </header>
  );
}