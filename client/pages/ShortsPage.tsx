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

const ShortsPage = () => {
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

  // Filter products for Men's Shorts (excluding women's inner wear shorts)
  const shorts = useMemo(() => {
    if (!products) return [];
    
    return products.filter((product: Product) => {
      const name = product.name?.toLowerCase() || '';
      const category = product.category?.name?.toLowerCase() || '';
      const subcategory = product.subcategory?.toLowerCase() || '';
      
      return (
        (name.includes('shorts') || name.includes('short')) &&
        !name.includes('women') && !name.includes('inner') && !name.includes('female') ||
        ((category.includes('shorts') || category.includes('short')) && 
         !category.includes('women') && !category.includes('inner')) ||
        ((subcategory.includes('shorts') || subcategory.includes('short')) && 
         !subcategory.includes('women') && !subcategory.includes('inner')) ||
        (subcategory === 'shorts' && category.includes('men')) ||
        (category === 'mens-bottomwear' && subcategory === 'shorts')
      );
    });
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...shorts];

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
  }, [shorts, sortBy, priceRange, searchQuery]);

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

  const handleQuickView = (productId: number) => {
    // Navigate to product detail page
    navigate(`/product/${productId}`);
  };

  // Mock data fallback
  const mockProducts = [
    {
      id: 'shorts-1',
      name: 'Premium Men\'s Shorts - Black',
      price: 899,
      rating: 4.5,
      description: 'Comfortable and stylish men\'s shorts perfect for casual wear and sports',
      image_url: '/placeholder.svg',
      created_at: new Date().toISOString(),
      category: { name: 'Men\'s Shorts' },
      subcategory: 'shorts'
    },
    {
      id: 'shorts-2',
      name: 'Cotton Sports Shorts - Navy',
      price: 699,
      rating: 4.3,
      description: 'Breathable cotton shorts for active lifestyle and workouts',
      image_url: '/placeholder.svg',
      created_at: new Date().toISOString(),
      category: { name: 'Men\'s Shorts' },
      subcategory: 'shorts'
    }
  ];

  const displayProducts = filteredAndSortedProducts.length > 0 ? filteredAndSortedProducts : mockProducts;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mb-4 animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading amazing men's shorts...</h3>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
              <p className="text-gray-600 mb-4">Error loading products: {error}</p>
              <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-500 text-white py-16 overflow-hidden pt-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce delay-300"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Men's Shorts
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover our premium collection of men's shorts. 
              Perfect for casual wear, sports, and active lifestyle with comfort and style.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                {displayProducts.length} Products
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
                <Star className="w-4 h-4 mr-2" />
                Premium Quality
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
                <Heart className="w-4 h-4 mr-2" />
                Customer Favorite
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
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Categories
          </Button>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
              <input
                type="text"
                placeholder="Search men's shorts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-blue-50/50"
              />
            </div>

            {/* Filters and View Toggle */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <div className="flex items-center border border-blue-200 rounded-lg bg-blue-50/50">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-blue-100'}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-blue-100'}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-blue-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Price Range</label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="border-blue-200 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-500">Under ₹500</SelectItem>
                      <SelectItem value="500-1000">₹500 - ₹1000</SelectItem>
                      <SelectItem value="1000-1500">₹1000 - ₹1500</SelectItem>
                      <SelectItem value="1500">Above ₹1500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    {displayProducts.length} Products
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
          {displayProducts.length > 0 ? (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {displayProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={parseInt(product.id)}
                  name={product.name || 'Unnamed Product'}
                  price={`₹${product.price || 0}`}
                  image={
                    product.images?.find(img => img.is_primary)?.image_url ||
                    product.images?.[0]?.image_url ||
                    product.image_url ||
                    '/placeholder.svg'
                  }
                  rating={product.rating || 4.0}
                  colors={
                    product.variants?.map(variant => ({
                      name: variant.color_name || 'Default',
                      color: variant.color_code || '#000000'
                    })) || []
                  }
                  onAddToCart={() => handleAddToCart(product)}
                  onQuickView={() => handleQuickView(parseInt(product.id))}
                  className={viewMode === 'list' ? 'flex-row' : ''}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="h-12 w-12 text-blue-600" />
              </div>
              <div className="text-blue-600 text-lg font-medium mb-4">No men's shorts found</div>
              <p className="text-blue-400 mb-6">
                Try adjusting your filters or search terms to find what you're looking for.
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setPriceRange('all');
                  setSortBy('name');
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ShortsPage;
