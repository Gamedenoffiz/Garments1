import React, { useState, useEffect } from "react";
import { useProducts, Product } from "../hooks/useProducts";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function ShoppingCart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}: ShoppingCartProps) {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { getRecommendedProducts } = useProducts();

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      setLoading(true);
      const products = await getRecommendedProducts(3);
      setRecommendedProducts(products);
      setLoading(false);
    };

    if (isOpen) {
      fetchRecommendedProducts();
    }
  }, [isOpen, getRecommendedProducts]);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      onRemoveItem(id);
    } else {
      onUpdateQuantity(id, newQuantity);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Cart Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-[400px] bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-[#111]">
              Shopping Cart ({cartItems.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 text-sm">
                  Add some products to get started
                </p>
              </div>
            ) : (
              <div className="space-y-6 p-4">
                {/* You may also like section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-[#111]">
                      You may also like
                    </h3>
                    <span className="text-xs text-gray-500">
                      Congratulations! You're eligible for free shipping!
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {loading ? (
                      // Loading skeleton
                      [...Array(3)].map((_, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-2 animate-pulse">
                          <div className="aspect-[3/4] bg-gray-200 rounded-md mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded mb-1"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      ))
                    ) : (
                      recommendedProducts.map((product) => {
                        const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
                        return (
                          <div
                            key={product.id}
                            className="group cursor-pointer bg-gray-50 rounded-lg p-2"
                          >
                            <div className="aspect-[3/4] bg-white rounded-md overflow-hidden mb-2">
                              <img
                                src={primaryImage?.image_url || '/placeholder.svg'}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                            <h4 className="text-xs font-medium text-[#111] line-clamp-2 mb-1">
                              {product.name}
                            </h4>
                            <p className="text-xs font-semibold text-[#111]">
                              Rs. {product.price.toLocaleString()}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Cart Items */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-16 h-20 bg-white rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#111] line-clamp-2 mb-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          Size: {item.size}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <span className="text-sm">-</span>
                            </button>
                            <span className="text-sm font-medium min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              <span className="text-sm">+</span>
                            </button>
                          </div>
                          <p className="text-sm font-semibold text-[#111]">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-[#111]">
                  Subtotal
                </span>
                <span className="text-lg font-bold text-[#111]">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link to="/cart">
                  <button 
                    onClick={onClose}
                    className="w-full bg-white border border-[#111] text-[#111] py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    VIEW CART
                  </button>
                </Link>
                <Link to="/checkout">
                  <button 
                    onClick={onClose}
                    className="w-full bg-[#111] text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    CHECKOUT
                  </button>
                </Link>
              </div>

              {/* Free shipping notice */}
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  🚚 Congratulations! You've qualified for free shipping!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
