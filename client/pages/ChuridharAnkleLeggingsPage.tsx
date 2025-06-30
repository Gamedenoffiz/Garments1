import React, { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import { ProductCard } from '../components/ui/product-card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Filter, Grid3X3, List, Search, Star, TrendingUp, Heart, Sparkles, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { Product } from '../hooks/useProducts';

const ChuridharAnkleLeggingsPage = () => {
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const { addToCart, cartItems } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [sortBy, setSortBy] = useState<string>('name');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const churidharAnkleLeggings = useMemo(() => {
    if (!products) return [];
    
    return products.filter((product: Product) => {
      const name = product.name?.toLowerCase() || '';
      const category = product.category?.name?.toLowerCase() || '';
      const subcategory = product.subcategory?.toLowerCase() || '';
      
      return (
        (name.includes('churidhar') && name.includes('ankle') && name.includes('legging')) ||
        (category.includes('churidhar') && category.includes('ankle') && category.includes('legging')) ||
        (subcategory.includes('churidhar') && subcategory.includes('ankle') && subcategory.includes('legging')) ||
        subcategory === 'churidhar ankle leggings' ||
        category === 'churidhar ankle leggings'
      );
    });
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...churidharAnkleLeggings];

    // Search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      result = result.filter(product => {
        const price = product.price || 0;
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

    return result;
  }, [churidharAnkleLeggings, sortBy, priceRange, searchQuery]);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    addToCart(product.id);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full mb-4 animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Churidhar Ankle Leggings...</h3>
              <p className="text-gray-600">Preparing our best collection for you</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
              <p className="text-gray-600 mb-4">Error loading products: {error}</p>
              <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700">
                Try Again
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-500 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce delay-300"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
              Churidhar Ankle Leggings Collection
            </h1>
            <p className="text-xl md:text-2xl text-teal-100 mb-8 max-w-3xl mx-auto">
              Traditional elegance meets comfort in our premium Churidhar Ankle Leggings collection
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                {filteredAndSortedProducts.length} Products
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                Premium Quality
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-teal-100 p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for your perfect Churidhar Ankle Leggings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-teal-600'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-teal-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Price Filter */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[200px] border-gray-200 focus:ring-teal-500 focus:border-teal-500">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-500">Under ₹500</SelectItem>
                  <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                  <SelectItem value="1000-2000">₹1,000 - ₹2,000</SelectItem>
                  <SelectItem value="2000">Above ₹2,000</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Filter */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px] border-gray-200 focus:ring-teal-500 focus:border-teal-500">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || priceRange !== 'all') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {searchQuery && (
                  <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="ml-2 hover:text-teal-900"
                    >
                      ×
                    </button>
                  </Badge>
                )}
                {priceRange !== 'all' && (
                  <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">
                    Price: {priceRange === '2000' ? 'Above ₹2,000' : `₹${priceRange.replace('-', ' - ₹')}`}
                    <button
                      onClick={() => setPriceRange('all')}
                      className="ml-2 hover:text-teal-900"
                    >
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Our Churidhar Ankle Leggings Collection'}
              </h2>
              <p className="text-gray-600">
                Showing {filteredAndSortedProducts.length} of {churidharAnkleLeggings.length} products
              </p>
            </div>

            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-6'
            }`}>
              {filteredAndSortedProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className={`group transition-all duration-300 hover:scale-105 ${
                    viewMode === 'list' ? 'bg-white rounded-xl shadow-lg border border-teal-100 p-6' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                    id={parseInt(product.id)}
                    name={product.name || 'Unnamed Product'}
                    price={`₹${(product.price || 0).toLocaleString()}`}
                    image={
                      product.images?.find(img => img.is_primary)?.image_url ||
                      product.images?.[0]?.image_url ||
                      '/placeholder.svg'
                    }
                    rating={product.rating || 4.0}
                    colors={
                      product.variants?.map(variant => ({
                        name: variant.color_name || 'Default',
                        color: variant.color_code || '#000000'
                      })) || [
                        { name: 'Black', color: '#000000' },
                        { name: 'Teal', color: '#0D9488' },
                        { name: 'Cyan', color: '#0891B2' }
                      ]
                    }
                    onAddToCart={() => handleAddToCart(product)}
                    className={`${
                      viewMode === 'list' 
                        ? 'flex flex-col sm:flex-row gap-6 shadow-none border-none' 
                        : 'bg-white rounded-xl shadow-lg border border-teal-100 hover:shadow-xl hover:border-teal-200'
                    } transition-all duration-300`}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-teal-100">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full mb-4">
                <ShoppingBag className="w-10 h-10 text-teal-500" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Churidhar Ankle Leggings found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchQuery || priceRange !== 'all' 
                ? "Try adjusting your search or filter criteria to find the perfect Churidhar Ankle Leggings for you."
                : "We're currently updating our Churidhar Ankle Leggings collection. Check back soon for new arrivals!"
              }
            </p>
            {(searchQuery || priceRange !== 'all') && (
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setPriceRange('all');
                }}
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
              >
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ChuridharAnkleLeggingsPage;
