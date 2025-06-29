import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PromoBanner from '@/components/PromoBanner';
import { ProductCard } from '@/components/ui/product-card';
import { useProducts, Product } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const ProductsPage = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subcategory = searchParams.get('subcategory');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const { getProductsByCategory, getAllProducts } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let productData: Product[] = [];
        
        if (category && category !== 'all') {
          // Convert URL category to database category slug
          const categorySlug = getCategorySlug(category);
          console.log('Fetching products for category:', category, 'mapped to:', categorySlug);
          productData = await getProductsByCategory(categorySlug);
        } else {
          console.log('Fetching all products');
          productData = await getAllProducts();
        }
        
        console.log('Fetched products:', productData.length);
        setProducts(productData);
        setFilteredProducts(productData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  useEffect(() => {
    console.log('Filtering with subcategory:', subcategory, 'Products count:', products.length);
    // Filter products based on subcategory
    if (subcategory && subcategory !== 'all') {
      const filtered = products.filter(product => {
        // Normalize both the product subcategory and filter for comparison
        const productSubcategory = (product.subcategory || '').toLowerCase().trim();
        const filterSubcategory = subcategory.toLowerCase().replace(/-/g, ' ').trim();
        
        // Check for exact match first
        if (productSubcategory === filterSubcategory) {
          return true;
        }
        
        // Check if product subcategory contains the filter term
        if (productSubcategory.includes(filterSubcategory)) {
          return true;
        }
        
        // Check if filter term contains the product subcategory
        if (filterSubcategory.includes(productSubcategory)) {
          return true;
        }
        
        // Special handling for common subcategory mappings
        const subcategoryMappings: { [key: string]: string[] } = {
          'track pants': ['track pants', 'track pant', 'trackpants', 'trackpant'],
          'round neck': ['round neck', 'roundneck', 'round-neck'],
          'v neck': ['v neck', 'v-neck', 'vneck'],
          'polo': ['polo', 'polo (collar)', 'collar'],
          'flat ankle': ['flat ankle', 'flat-ankle', 'flatankle'],
          'full length': ['full length', 'full-length', 'fulllength'],
          'churidhar ankle': ['churidhar ankle', 'churidhar-ankle'],
          'churidhar full length': ['churidhar full length', 'churidhar-full-length'],
          '3/4 length': ['3/4 length', '3-4 length', '3/4', '3-4'],
          'night t-shirt': ['night t-shirt', 'night tshirt', 'night-tshirt'],
          'lycra cotton': ['lycra cotton', 'lycra-cotton'],
          'basic slips': ['basic slips', 'basic-slips', 'basic slip'],
          'adjustment slips': ['adjustment slips', 'adjustment-slips', 'adjustment slip']
        };
        
        // Check mappings
        for (const [key, variations] of Object.entries(subcategoryMappings)) {
          if (variations.includes(filterSubcategory) && variations.some(v => productSubcategory.includes(v))) {
            return true;
          }
        }
        
        // Also check product name and description for subcategory terms
        const productName = product.name.toLowerCase();
        const productDescription = (product.description || '').toLowerCase();
        
        return productName.includes(filterSubcategory) || productDescription.includes(filterSubcategory);
      });
      
      console.log('Filtered products count:', filtered.length);
      setFilteredProducts(filtered);
      setSelectedFilter(subcategory);
    } else {
      setFilteredProducts(products);
      setSelectedFilter('all');
    }
  }, [subcategory, products]);

  const getCategorySlug = (category: string): string => {
    console.log('Mapping category:', category);
    const categoryMap: { [key: string]: string } = {
      'men': 'mens-t-shirts',
      'men-tshirts': 'mens-t-shirts',
      'men-bottomwear': 'mens-bottomwear',
      'women': 'womens-leggings',
      'women-leggings': 'womens-leggings',
      'shapewear': 'saree-shapewear',
      'nightwear': 'night-wear'
    };
    const mapped = categoryMap[category] || category;
    console.log('Mapped to:', mapped);
    return mapped;
  };

  const getCategoryDisplayName = (category: string): string => {
    const displayMap: { [key: string]: string } = {
      'men': "Men's Collection",
      'men-tshirts': "Men's T-Shirts",
      'men-bottomwear': "Men's Bottomwear",
      'women': "Women's Collection",
      'women-leggings': "Women's Leggings",
      'shapewear': "Saree Shapewear",
      'nightwear': "Night Wear",
      'all': "All Products"
    };
    return displayMap[category || 'all'] || category || 'All Products';
  };

  const getSubcategoryFilters = (category: string): string[] => {
    const filterMap: { [key: string]: string[] } = {
      'men': ['All', 'T-Shirts', 'Round Neck', 'V-Neck', 'Polo', 'Track Pants', 'Shorts'],
      'men-tshirts': ['All', 'Round Neck', 'V-Neck', 'Polo', 'Long Sleeve', 'Sleeveless'],
      'men-bottomwear': ['All', 'Track Pants', 'Shorts'],
      'women': ['All', 'Leggings', 'Shapewear', 'Night Wear', '3/4 Leggings'],
      'women-leggings': ['All', 'Flat Ankle', 'Full Length', 'Churidhar', 'Shimmer', '3/4 Length'],
      'shapewear': ['All', 'Lycra Cotton', 'Polyester', 'Shimmer'],
      'nightwear': ['All', 'Night T-Shirts', 'Shorts']
    };
    return filterMap[category || 'all'] || ['All'];
  };

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter);
    if (filter === 'All' || filter === 'all') {
      setFilteredProducts(products);
    } else {
      const filterLower = filter.toLowerCase().trim();
      const filtered = products.filter(product => {
        const productSubcategory = (product.subcategory || '').toLowerCase().trim();
        const productName = product.name.toLowerCase();
        const productDescription = (product.description || '').toLowerCase();
        
        // Direct match
        if (productSubcategory === filterLower) {
          return true;
        }
        
        // Contains match
        if (productSubcategory.includes(filterLower) || 
            productName.includes(filterLower) || 
            productDescription.includes(filterLower)) {
          return true;
        }
        
        // Special mappings for common terms
        const mappings: { [key: string]: string[] } = {
          'track pants': ['track pants', 'track pant', 'trackpants'],
          'round neck': ['round neck', 'roundneck'],
          'v-neck': ['v neck', 'v-neck', 'vneck'],
          'polo': ['polo', 'collar'],
          'flat ankle': ['flat ankle', 'flatankle'],
          'full length': ['full length', 'fulllength'],
          'churidhar': ['churidhar ankle', 'churidhar full length'],
          'shimmer': ['shimmer'],
          '3/4 length': ['3/4', '3-4'],
          'night t-shirts': ['night t-shirt', 'night tshirt'],
          'shorts': ['shorts', 'short'],
          'lycra cotton': ['lycra cotton'],
          'polyester': ['polyester', 'poliston']
        };
        
        const variations = mappings[filterLower] || [filterLower];
        return variations.some(variation => 
          productSubcategory.includes(variation) || 
          productName.includes(variation) || 
          productDescription.includes(variation)
        );
      });
      setFilteredProducts(filtered);
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
      // Find the product to get available variants
      const product = products.find(p => p.id === productId);
      if (!product) {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive"
        });
        return;
      }

      // Get the first available variant or null if no variants
      const firstVariant = product.variants?.find(v => v.is_active && v.stock_quantity > 0);
      
      await addToCart(productId, firstVariant?.id || null, 1);
      
      // Show success message
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

  const handleQuickView = (productId: string) => {
    console.log('Quick view:', productId);
    // Navigate to all-products page with the product selected
    navigate(`/all-products?product=${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <PromoBanner />
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryDisplayName = getCategoryDisplayName(category || 'all');
  const subcategoryFilters = getSubcategoryFilters(category || 'all');

  return (
    <div className="min-h-screen bg-white">
      <PromoBanner />
      <Header />
      
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-4">
            <a href="/" className="hover:text-[#7C3AED]">Home</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{categoryDisplayName}</span>
            {subcategory && subcategory !== 'all' && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-900 capitalize">{subcategory.replace(/-/g, ' ')}</span>
              </>
            )}
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {categoryDisplayName}
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Filter Tabs */}
        {subcategoryFilters.length > 1 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {subcategoryFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedFilter.toLowerCase() === filter.toLowerCase() ||
                    (selectedFilter === 'all' && filter === 'All')
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white">
                <ProductCard
                  id={parseInt(product.id)}
                  name={product.name}
                  price={`Rs. ${product.price.toLocaleString()}.00`}
                  image={product.images?.[0]?.image_url || '/placeholder.svg'}
                  rating={product.rating || 4}
                  colors={[
                    { name: 'Black', color: '#000' },
                    { name: 'White', color: '#fff' },
                    { name: 'Purple', color: '#7C3AED' }
                  ]}
                  onAddToCart={() => handleAddToCart(product.id)}
                  onQuickView={() => handleQuickView(product.id)}
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
              Try adjusting your filters or browse our other categories.
            </p>
            <a
              href="/products/all"
              className="inline-block bg-[#7C3AED] text-white px-6 py-3 rounded-lg hover:bg-[#6B21A8] transition-colors"
            >
              View All Products
            </a>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;