import React, { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import { ProductCard } from '../components/ui/product-card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Filter, Grid3X3, List, Search, Star, TrendingUp, Heart, Sparkles, ShoppingBag, Shirt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { Product } from '../hooks/useProducts';

const PantiesPage = () => {
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

  const panties = useMemo(() => {
    if (!products) return [];
    
    return products.filter((product: Product) => {
      const name = product.name?.toLowerCase() || '';
      const category = product.category?.name?.toLowerCase() || '';
      const subcategory = product.subcategory?.toLowerCase() || '';
      
      return (
        name.includes('panties') ||
        name.includes('panty') ||
        name.includes('underwear') ||
        name.includes('briefs') ||
        category.includes('panties') ||
        subcategory.includes('panties') ||
        subcategory === 'panties' ||
        (name.includes('inner') && (name.includes('brief') || name.includes('pant')))
      );
    });
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...panties];

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
  }, [panties, sortBy, priceRange, searchQuery]);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    addToCart(product.id, null, 1);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart`,
    });
  };

  const activeFilters = useMemo(() => {
    const filters = [];
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      filters.push(`Price: ₹${min}${max ? ` - ₹${max}` : '+'}`);
    }
    if (searchQuery) {
      filters.push(`Search: "${searchQuery}"`);
    }
    return filters;
  }, [priceRange, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-pink-50 to-rose-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
            <p className="text-fuchsia-600 font-medium">Loading panties collection...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-pink-50 to-rose-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-4">We couldn't load the panties collection</p>
            <Button onClick={() => window.location.reload()} className="bg-fuchsia-600 hover:bg-fuchsia-700">
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-pink-50 to-rose-50">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce delay-300"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <Shirt className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-fuchsia-100 bg-clip-text text-transparent">
              Panties Collection
            </h1>
            <p className="text-xl md:text-2xl text-fuchsia-100 mb-8 max-w-3xl mx-auto">
              Ultimate comfort and style - Premium panties for everyday confidence
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
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-fuchsia-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg border border-fuchsia-100 p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for comfortable panties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
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
                      ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-fuchsia-600'
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
                      ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-fuchsia-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Sort Select */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-gray-200 focus:ring-fuchsia-500">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Filter */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-48 border-gray-200 focus:ring-fuchsia-500">
                  <SelectValue placeholder="Price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-300">Under ₹300</SelectItem>
                  <SelectItem value="300-600">₹300 - ₹600</SelectItem>
                  <SelectItem value="600-1000">₹600 - ₹1000</SelectItem>
                  <SelectItem value="1000">Above ₹1000</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-gray-200 hover:border-fuchsia-300 hover:text-fuchsia-600 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200">
                    {filter}
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPriceRange('all');
                    setSearchQuery('');
                  }}
                  className="text-fuchsia-600 hover:text-fuchsia-700 hover:bg-fuchsia-50"
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredAndSortedProducts.length} panties product{filteredAndSortedProducts.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Products Grid/List */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-fuchsia-100">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No panties found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setPriceRange('all');
                setSortBy('name');
              }}
              className="bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredAndSortedProducts.map((product) => {
              const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
              return (
                <ProductCard
                  key={product.id}
                  id={parseInt(product.id)}
                  name={product.name || ''}
                  price={`₹${product.price?.toLocaleString() || '0'}`}
                  image={primaryImage?.image_url || '/placeholder.svg'}
                  rating={product.rating}
                  onAddToCart={() => handleAddToCart(product)}
                  className={`bg-white border border-fuchsia-100 hover:border-fuchsia-300 transition-all duration-300 hover:shadow-lg ${
                    viewMode === 'list' ? 'flex items-center p-4' : ''
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {filteredAndSortedProducts.length > 0 && (
          <div className="mt-12 text-center">
            <Button
              variant="outline"
              className="border-fuchsia-300 text-fuchsia-600 hover:bg-fuchsia-50 hover:border-fuchsia-400 px-8 py-3"
            >
              Load More Products
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PantiesPage;
