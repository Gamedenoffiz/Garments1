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

const PolyesterShapewearPage = () => {
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

  const polyesterShapewear = useMemo(() => {
    if (!products) return [];
    
    return products.filter((product: Product) => {
      const name = product.name?.toLowerCase() || '';
      const category = product.category?.name?.toLowerCase() || '';
      const subcategory = product.subcategory?.toLowerCase() || '';
      
      return (
        (name.includes('polyester') && name.includes('shapewear')) ||
        (category.includes('polyester') && category.includes('shapewear')) ||
        (subcategory.includes('polyester') && subcategory.includes('shapewear')) ||
        subcategory === 'polyester shapewear' ||
        category === 'polyester shapewear'
      );
    });
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...polyesterShapewear];

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
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

    return result;
  }, [polyesterShapewear, sortBy, priceRange, searchQuery]);

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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-purple-600 animate-pulse">Loading polyester shapewear...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-red-600">Error loading products: {error}</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
      <Header />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-purple-200 mr-3" />
              <Badge variant="secondary" className="bg-purple-200 text-purple-800 border-0">
                Premium Collection
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Polyester Shapewear
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Premium polyester shapewear for ultimate comfort and style. Experience the perfect blend of durability and elegance.
            </p>
            <div className="flex items-center justify-center gap-6 text-purple-200">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-current" />
                <span>4.8+ Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                <span>10k+ Happy Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <span>Trending Now</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Saree Shapewear
          </Button>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search polyester shapewear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[160px] border-purple-200 focus:ring-purple-500">
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

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] border-purple-200 focus:ring-purple-500">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-purple-600 hover:bg-purple-700' : 'hover:bg-purple-50 text-purple-600'}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-purple-600 hover:bg-purple-700' : 'hover:bg-purple-50 text-purple-600'}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-purple-200 text-purple-600">
                {filteredAndSortedProducts.length} Products
              </Badge>
              {searchQuery && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  Searching: "{searchQuery}"
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShoppingBag className="h-4 w-4" />
              <span>Free shipping on orders above ₹999</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "grid grid-cols-1 md:grid-cols-2 gap-4"
          }>
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={parseInt(product.id)}
                name={product.name || 'Unnamed Product'}
                price={`₹${product.price || 0}`}
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
                  })) || []
                }
                onAddToCart={() => handleAddToCart(product)}
                className={viewMode === 'list' ? 'flex-row' : ''}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? `No polyester shapewear found matching "${searchQuery}". Try adjusting your search terms.`
                  : 'No polyester shapewear products match your current filters. Try adjusting your criteria.'
                }
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setPriceRange('all');
                  setSortBy('name');
                }}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {filteredAndSortedProducts.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Love our Polyester Shapewear?</h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust our premium polyester shapewear collection.
              Experience comfort, style, and confidence like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
                <Star className="h-5 w-5 mr-2" />
                Rate Collection
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PolyesterShapewearPage;
