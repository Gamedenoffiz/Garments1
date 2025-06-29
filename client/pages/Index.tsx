import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PromoBanner from "../components/PromoBanner";
import Header from "../components/Header";
import HeroBanner from "../components/HeroBanner";
import CategoryShowcase from "../components/CategoryShowcase";
import BestSelling from "../components/BestSelling";
import InstagramFeed from "../components/InstagramFeed";
import FeaturedArticle from "../components/FeaturedArticle";
import Footer from "../components/Footer";
import MobileBottomNavigation from "../components/MobileBottomNavigation";
import ShoppingCart from "../components/ShoppingCart";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

export default function Index() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems: dbCartItems, addToCart, updateQuantity, removeFromCart, loading: cartLoading } = useCart();

  // Convert database cart items to the format expected by ShoppingCart component
  const cartItems: CartItem[] = dbCartItems.map(item => ({
    id: item.id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    size: item.variant?.size || 'N/A',
    image: item.product.images.find(img => img.is_primary)?.image_url || '/placeholder.svg'
  }));

  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const handleAddToCart = async (product: {
    id: string;
    name: string;
    price: number;
    size?: string;
    image?: string;
  }) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      // For now, we'll add without a specific variant
      // In a full implementation, you'd want to handle size/color selection
      await addToCart(product.id, undefined, 1);
      setIsCartOpen(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart. Please try again.');
    }
  };
  const handleQuickView = (productId: string) => {
    // Navigate to all-products page with the product selected
    navigate(`/all-products?product=${productId}`);
  };

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    try {
      await updateQuantity(id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Error updating quantity. Please try again.');
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await removeFromCart(id);
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Error removing item. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PromoBanner />
      <Header
        cartItemsCount={totalCartItems}
        onCartClick={() => setIsCartOpen(true)}
      />
      <HeroBanner />
      <CategoryShowcase />
      <BestSelling
        onAddToCart={handleAddToCart}
        onQuickView={handleQuickView}
      />
      <InstagramFeed />
      <FeaturedArticle />
      <Footer />
      <MobileBottomNavigation />

      {/* Shopping Cart Drawer */}
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}