import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PromoBanner from '@/components/PromoBanner';
import { ProductCard } from '@/components/ui/product-card';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';

const ProductsViewPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { getAllProducts } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  // Get initial filters from URL params
  useEffect(() => {
    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'name';
    
    setFilterCategory(category);
    setSearchQuery(search);
    setSortBy(sort);
  }, [searchParams]);

  // Handle product selection from URL
  useEffect(() => {
    const productId = searchParams.get('product');
    if (productId && products.length > 0 && !loading) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        setSelectedImageIndex(0);
        const firstVariant = product.variants?.[0];
        if (firstVariant) {
          setSelectedSize(firstVariant.size || "");
          setSelectedColor(firstVariant.color_name || "");
        }
        setQuantity(1);
      }
    } else if (!productId) {
      setSelectedProduct(null);
    }
  }, [products, searchParams, loading]);

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
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category?.slug === filterCategory || 
        product.category?.name.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    // Subcategory filter from URL
    const subcategory = searchParams.get('subcategory');
    if (subcategory) {
      const subcategoryFormatted = subcategory.replace(/-/g, ' ').toLowerCase();
      filtered = filtered.filter(product => 
        product.subcategory?.toLowerCase().includes(subcategoryFormatted)
      );
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
  }, [products, filterCategory, searchQuery, priceRange, sortBy, searchParams]);

  const handleQuickView = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setSelectedImageIndex(0);
      // Set default size and color from variants
      const firstVariant = product.variants?.[0];
      if (firstVariant) {
        setSelectedSize(firstVariant.size || "");
        setSelectedColor(firstVariant.color_name || "");
      }
      setQuantity(1);
      
      // Update URL to reflect the selected product
      const newParams = new URLSearchParams(searchParams);
      newParams.set('product', productId);
      setSearchParams(newParams);
    }
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

  const updateUrlParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === '' || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'mens-t-shirts', label: "Men's T-Shirts" },
    { value: 'mens-bottomwear', label: "Men's Bottomwear" },
    { value: 'womens-leggings', label: "Women's Leggings" },
    { value: 'womens-sarees-shapewear', label: "Women's Shapewear" },
    { value: 'womens-night-wear', label: "Women's Night Wear" },
    { value: 'womens-innerwear', label: "Women's Innerwear" }
  ];

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
      
      {selectedProduct ? (
        /* Product Detail View */
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => {
              setSelectedProduct(null);
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('product');
              setSearchParams(newParams);
            }}
            className="flex items-center gap-2 text-[#7C3AED] hover:text-[#6D28D9] mb-6"
          >
            ← Back to Products
          </button>

          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <button 
                onClick={() => {
                  setSelectedProduct(null);
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('product');
                  setSearchParams(newParams);
                }} 
                className="text-[#111] hover:text-[#7C3AED]"
              >
                Products
              </button>
              <span>/</span>
              <span className="text-[#111] hover:text-[#7C3AED]">
                {selectedProduct.category?.name || 'General'}
              </span>
              {selectedProduct.subcategory && (
                <>
                  <span>/</span>
                  <span className="text-[#111] hover:text-[#7C3AED]">
                    {selectedProduct.subcategory}
                  </span>
                </>
              )}
              <span>/</span>
              <span className="text-gray-500">{selectedProduct.name}</span>
            </div>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={selectedProduct.images?.[selectedImageIndex]?.image_url || '/placeholder.svg'}
                  alt={selectedProduct.images?.[selectedImageIndex]?.alt_text || selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Images */}
              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {selectedProduct.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-[#7C3AED]' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image.image_url}
                        alt={image.alt_text || `${selectedProduct.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-[#111] mb-2">{selectedProduct.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < (selectedProduct.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({selectedProduct.review_count || 0} reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#111]">
                  Rs. {selectedProduct.price.toLocaleString()}.00
                </span>
                {selectedProduct.original_price && selectedProduct.original_price > selectedProduct.price && (
                  <span className="text-xl text-gray-400 line-through">
                    Rs. {selectedProduct.original_price.toLocaleString()}.00
                  </span>
                )}
                {selectedProduct.is_hot_sale && (
                  <span className="bg-red-500 text-white px-2 py-1 text-sm rounded">
                    Hot Sale
                  </span>
                )}
              </div>

              {/* Description */}
              {selectedProduct.description && (
                <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
              )}

              {/* Size Selection */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[#111] mb-3">Size:</h3>
                  <div className="flex gap-2">
                    {[...new Set(selectedProduct.variants.map(v => v.size).filter(Boolean))].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size!)}
                        className={`px-4 py-2 border rounded-md text-sm font-medium ${
                          selectedSize === size
                            ? 'border-[#7C3AED] bg-[#7C3AED] text-white'
                            : 'border-gray-300 text-[#111] hover:border-[#7C3AED]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[#111] mb-3">Color:</h3>
                  <div className="flex gap-2">
                    {[...new Set(selectedProduct.variants.map(v => ({
                      name: v.color_name,
                      code: v.color_code
                    })).filter(c => c.name))].map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color.name || '')}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColor === color.name
                            ? 'border-[#7C3AED] border-2'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.code || '#ccc' }}
                        title={color.name || ''}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-green-600">In Stock</span>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-[#111]"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-[#111]"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => handleAddToCart(selectedProduct.id)}
                  className="flex-1 bg-[#7C3AED] text-white px-6 py-3 rounded-md font-medium hover:bg-[#6D28D9]"
                >
                  Add to Cart
                </button>
              </div>

              {/* Product Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#111]">Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#7C3AED] rounded-full"></span>
                    Premium Quality Material
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#7C3AED] rounded-full"></span>
                    Comfortable Fit
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#7C3AED] rounded-full"></span>
                    Easy Care Instructions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Product List View */
        <div>
          {/* Page Header */}
          <div className="bg-gray-50 py-8">
            <div className="max-w-[1400px] mx-auto px-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">All Products</h1>
              <p className="text-gray-600">Discover our complete collection of quality products</p>
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
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      updateUrlParams('search', e.target.value);
                    }}
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={filterCategory}
                        onChange={(e) => {
                          setFilterCategory(e.target.value);
                          updateUrlParams('category', e.target.value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => {
                          setSortBy(e.target.value);
                          updateUrlParams('sort', e.target.value);
                        }}
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
                  Showing {filteredProducts.length} of {products.length} products
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
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => {
                    setFilterCategory('all');
                    setSearchQuery('');
                    setPriceRange({ min: 0, max: 10000 });
                    setSearchParams(new URLSearchParams());
                  }}
                  className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductsViewPage;
