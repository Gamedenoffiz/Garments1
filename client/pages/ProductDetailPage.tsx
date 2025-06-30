import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Minus, Plus, ArrowLeft, Share2, Truck, RotateCcw, Shield } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import type { Product } from '../hooks/useProducts';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');

  useEffect(() => {
    if (products && id) {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
      if (foundProduct) {
        // Set default variant selections
        const firstVariant = foundProduct.variants?.[0];
        if (firstVariant) {
          setSelectedSize(firstVariant.size || '');
          setSelectedColor(firstVariant.color_name || '');
        }
      }
    }
  }, [products, id]);

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addToCart(product.id);
    }

    toast({
      title: "Added to cart",
      description: `${quantity}x ${product.name} added to your cart`,
    });
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, Math.min(10, prev + change)));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate(-1)} className="bg-blue-600 hover:bg-blue-700">
              Go Back
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const productImages = product.images || [];
  const primaryImage = productImages.find(img => img.is_primary) || productImages[0];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-800">
              Home
            </button>
            <span>/</span>
            <span className="text-blue-600 hover:text-blue-800">
              {product.category?.name || 'Products'}
            </span>
            {product.subcategory && (
              <>
                <span>/</span>
                <span className="text-blue-600 hover:text-blue-800">
                  {product.subcategory}
                </span>
              </>
            )}
            <span>/</span>
            <span className="text-gray-500">{product.name}</span>
          </div>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={primaryImage?.image_url || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating || 4.5)}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.rating || 4.5}) • 127 reviews
                </span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-gray-900 mb-6">
                ₹{(product.price || 0).toLocaleString()}
              </div>
            </div>

            {/* Product Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                {/* Size Selection */}
                {product.variants.some(v => v.size) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size
                    </label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...new Set(product.variants.map(v => v.size).filter(Boolean))].map((size) => (
                          <SelectItem key={size} value={size!}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Color Selection */}
                {product.variants.some(v => v.color_name) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <div className="flex gap-2">
                      {[...new Set(product.variants.map(v => ({ name: v.color_name, code: v.color_code })).filter(c => c.name))].map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedColor(color.name!)}
                          className={`w-8 h-8 rounded-full border-2 transition-colors ${
                            selectedColor === color.name ? 'border-gray-800' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color.code || '#000000' }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 ${isWishlisted ? 'text-red-500 border-red-500' : ''}`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" className="p-3">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <div className="text-sm">
                    <div className="font-medium">Free Shipping</div>
                    <div className="text-gray-600">On orders over ₹999</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-blue-600" />
                  <div className="text-sm">
                    <div className="font-medium">Easy Returns</div>
                    <div className="text-gray-600">30-day return policy</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div className="text-sm">
                    <div className="font-medium">Secure Payment</div>
                    <div className="text-gray-600">100% secure checkout</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              {[
                { key: 'description', label: 'Description' },
                { key: 'reviews', label: 'Reviews (127)' },
                { key: 'shipping', label: 'Shipping & Returns' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Premium quality material</li>
                    <li>Comfortable fit and feel</li>
                    <li>Durable construction</li>
                    <li>Easy care instructions</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <Button variant="outline">Write a Review</Button>
                </div>
                
                {/* Sample Reviews */}
                <div className="space-y-4">
                  {[
                    { name: 'Sarah J.', rating: 5, comment: 'Excellent quality and fast delivery!' },
                    { name: 'Mike R.', rating: 4, comment: 'Great product, fits perfectly.' },
                    { name: 'Priya S.', rating: 5, comment: 'Love the material and comfort.' },
                  ].map((review, index) => (
                    <div key={index} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <span className="font-medium">{review.name}</span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="prose max-w-none">
                <h4 className="font-semibold text-gray-900 mb-4">Shipping Information</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Free shipping on orders over ₹999</li>
                  <li>• Standard delivery: 3-5 business days</li>
                  <li>• Express delivery: 1-2 business days (additional charges apply)</li>
                  <li>• Cash on delivery available</li>
                </ul>
                
                <h4 className="font-semibold text-gray-900 mb-4 mt-8">Return Policy</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• 30-day return policy</li>
                  <li>• Items must be in original condition</li>
                  <li>• Free returns on defective items</li>
                  <li>• Refund processed within 5-7 business days</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
