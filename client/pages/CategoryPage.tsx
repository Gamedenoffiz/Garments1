import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PromoBanner from '@/components/PromoBanner';
import { ProductCard } from '@/components/ui/product-card';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showFilters, setShowFilters] = useState(false);

  const { getAllProducts } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  // Category mappings for better filtering
  const categoryMappings: { [key: string]: { category: string, subcategories?: string[] } } = {
    'men': { category: 'men' },
    'women': { category: 'women' },
    't-shirts': { category: 'men', subcategories: ['T-Shirts', 'Round Neck T-Shirts', 'V-Neck T-Shirts', 'Polo T-Shirts', 'Long Sleeve T-Shirts', 'Sleeveless T-Shirts', 'Full Hand T-Shirts'] },
    'round-neck-t-shirts': { category: 'men', subcategories: ['Round Neck T-Shirts'] },
    'v-neck-t-shirts': { category: 'men', subcategories: ['V-Neck T-Shirts'] },
    'polo-t-shirts': { category: 'men', subcategories: ['Polo T-Shirts'] },
    'long-sleeve-t-shirts': { category: 'men', subcategories: ['Long Sleeve T-Shirts'] },
    'sleeveless-t-shirts': { category: 'men', subcategories: ['Sleeveless T-Shirts'] },
    'full-hand-t-shirts': { category: 'men', subcategories: ['Full Hand T-Shirts'] },
    'track-pants': { category: 'men', subcategories: ['Track Pants'] },
    'shorts': { category: 'men', subcategories: ['Shorts'] },
    'leggings': { category: 'women', subcategories: ['Leggings', 'Flat Ankle Leggings', 'Flat Full Length Leggings', 'Churidhar Ankle Leggings', 'Churidhar Full Length Leggings', 'Shimmer Leggings', '3/4 Leggings'] },
    'flat-ankle-leggings': { category: 'women', subcategories: ['Flat Ankle Leggings'] },
    'flat-full-length-leggings': { category: 'women', subcategories: ['Flat Full Length Leggings'] },
    'churidhar-ankle-leggings': { category: 'women', subcategories: ['Churidhar Ankle Leggings'] },
    'churidhar-full-length-leggings': { category: 'women', subcategories: ['Churidhar Full Length Leggings'] },
    'shimmer-leggings': { category: 'women', subcategories: ['Shimmer Leggings'] },
    'saree-shapewear': { category: 'women', subcategories: ['Saree Shapewear'] },
    'lycra-cotton-shapewear': { category: 'women', subcategories: ['Lycra Cotton Shapewear'] },
    'polyester-shapewear': { category: 'women', subcategories: ['Polyester Shapewear'] },
    'shimmer-shapewear': { category: 'women', subcategories: ['Shimmer Shapewear'] },
    'night-wear': { category: 'women', subcategories: ['Night Wear'] },
    'night-t-shirts': { category: 'women', subcategories: ['Night T-Shirts'] },
    '3-4-leggings': { category: 'women', subcategories: ['3/4 Leggings'] },
    'women-shorts': { category: 'women', subcategories: ['Shorts'] },
  };

  // Get page title based on category
  const getPageTitle = () => {
    if (category) {
      const mapping = categoryMappings[category];
      if (mapping && mapping.subcategories && mapping.subcategories.length === 1) {
        return mapping.subcategories[0];
      }
      return category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return 'Products';
  };

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [getAllProducts, toast]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    if (category && categoryMappings[category]) {
      const mapping = categoryMappings[category];
      
      // Filter by main category first
      filtered = filtered.filter(product => 
        product.category?.name.toLowerCase() === mapping.category ||
        product.category?.slug === mapping.category
      );

      // Then filter by subcategories if specified
      if (mapping.subcategories) {
        filtered = filtered.filter(product => 
          mapping.subcategories!.some(subcat => 
            product.subcategory?.toLowerCase().includes(subcat.toLowerCase()) ||
            product.name.toLowerCase().includes(subcat.toLowerCase())
          )
        );
      }
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.subcategory?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, category, searchQuery, priceRange, sortBy]);

  const handleQuickView = (productId: string) => {
    navigate(`/all-products?product=${productId}`);
  };

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive"
      });
      return;
    }

    try {
      const product = products.find(p => p.id === productId);
      if (!product) {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive"
        });
        return;
      }

      const firstVariant = product.variants?.find(v => v.is_active && v.stock_quantity > 0);
      
      await addToCart(productId, firstVariant?.id || null, 1);
      
      const variantInfo = firstVariant 
        ? ` (${firstVariant.size || 'Standard'} - ${firstVariant.color_name || 'Default'})` 
        : '';
      
      toast({
        title: "Added to Cart!",
        description: `${product.name}${variantInfo} added to cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Error adding to cart. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <PromoBanner />
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PromoBanner />
      <Header />
      
      {/* Page Header */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-[1400px] mx-auto px-8">
          <nav className="mb-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <button onClick={() => navigate('/')} className="text-[#111] hover:text-[#7C3AED]">
                Home
              </button>
              <span>/</span>
              <span className="text-gray-500">{getPageTitle()}</span>
            </div>
          </nav>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{getPageTitle()}</h1>
          <p className="text-gray-600">
            Discover our collection of {getPageTitle().toLowerCase()}
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Filters and Search Bar */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
              />
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#7C3AED] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[#7C3AED] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="price-low">Price (Low to High)</option>
                    <option value="price-high">Price (High to Low)</option>
                    <option value="rating">Rating</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ₹{priceRange.min} - ₹{priceRange.max}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">
              Showing {filteredProducts.length} products
            </p>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredProducts.map((product) => (
              <div key={product.id} className={viewMode === 'list' ? 'border-b border-gray-200 pb-4' : ''}>
                <ProductCard
                  id={parseInt(product.id)}
                  name={product.name}
                  price={`₹${product.price.toLocaleString()}`}
                  image={product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url || '/placeholder.svg'}
                  rating={product.rating || 4}
                  colors={product.variants?.filter(v => v.color_code).map(v => ({
                    name: v.color_name || 'Color',
                    color: v.color_code || '#000000'
                  })) || [
                    { name: 'Black', color: '#000000' },
                    { name: 'White', color: '#ffffff' },
                    { name: 'Purple', color: '#7C3AED' }
                  ]}
                  onAddToCart={() => handleAddToCart(product.id)}
                  onQuickView={() => handleQuickView(product.id)}
                  className={viewMode === 'list' ? 'flex gap-4 items-center' : ''}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found in {getPageTitle()}
            </h3>
            <p className="text-gray-600 mb-6">
              Try browsing other categories or check back later
            </p>
            <button
              onClick={() => navigate('/all-products')}
              className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors"
            >
              Browse All Products
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
