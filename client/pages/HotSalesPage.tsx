import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeft, Flame, Star, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';

const HotSalesPage = () => {
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const { addToCart } = useCart();
  
  // Filter for products on sale (using is_hot_sale flag or products with original_price higher than current price)
  const hotSalesProducts = products.filter(product => 
    product.is_hot_sale || (product.original_price && product.original_price > product.price)
  ).slice(0, 12); // Show top 12 hot sales items

  const handleAddToCart = async (product: any) => {
    try {
      await addToCart(product, "1");
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#7C3AED]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-red-600">
            <p>Error loading hot sales: {error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#7C3AED] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Hot Sales
            </h1>
            <Flame className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these amazing deals! Limited time offers on our bestselling items.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Limited Time Offers
          </div>
        </div>

        {/* Hot Sales Products Grid */}
        {hotSalesProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hotSalesProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200 overflow-hidden group">
                {/* Sale Badge */}
                <div className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    {product.is_hot_sale && (
                      <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        HOT SALE
                      </div>
                    )}
                    {product.original_price && product.original_price > product.price && (
                      <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 mt-1">
                        <Flame className="w-3 h-3" />
                        {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  
                  {/* Product Image */}
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.images?.[0]?.image_url || '/placeholder.svg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-[#7C3AED] transition-colors cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}>
                    {product.name}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 4.5)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">
                      ({product.rating || '4.5'})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-[#7C3AED]">
                      ₹{product.price}
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.original_price}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No Hot Sales Available */
          <div className="text-center py-16">
            <Flame className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Hot Sales Available
            </h3>
            <p className="text-gray-500 mb-6">
              Check back soon for amazing deals and discounts!
            </p>
            <Button
              onClick={() => navigate('/all-products')}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white"
            >
              Browse All Products
            </Button>
          </div>
        )}

        {/* Promotion Banner */}
        <div className="mt-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">🔥 Don't Miss Out!</h2>
          <p className="text-lg mb-4">Get up to 50% off on selected items. Limited time only!</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span>✓</span>
              <span>Free Shipping on orders above ₹999</span>
            </div>
            <div className="flex items-center gap-1">
              <span>✓</span>
              <span>Easy Returns & Exchange</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HotSalesPage;
