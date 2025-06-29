import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProductRow } from "./ui/product-card";
import { useProducts, Product } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface BestSellingProps {
  onAddToCart?: (product: {
    id: string;
    name: string;
    price: number;
    size?: string;
    image?: string;
  }) => void;
  onQuickView?: (productId: string) => void;
}

export default function BestSelling({
  onAddToCart,
  onQuickView,
}: BestSellingProps) {
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { getHotSaleProducts } = useProducts();
  const { addToCart: addToDbCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const hotSaleProducts = await getHotSaleProducts();
        setBestSellingProducts(hotSaleProducts);
      } catch (error) {
        console.error('Error fetching best selling products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSelling();
  }, [getHotSaleProducts]);

  // Convert database products to the format expected by ProductRow
  const products = bestSellingProducts.map(product => ({
    id: parseInt(product.id), // Convert to number for ProductCard compatibility
    name: product.name,
    price: `Rs. ${product.price.toLocaleString()}.00`,
    image: product.images?.[0]?.image_url || '/placeholder.svg',
    rating: product.rating || 4,
    colors: product.variants?.filter(v => v.color_code).map(v => ({
      name: v.color_name || 'Color',
      color: v.color_code || '#000000'
    })) || [
      { name: 'Black', color: '#000000' },
      { name: 'White', color: '#ffffff' },
      { name: 'Gray', color: '#808080' }
    ],
    sizes: product.variants?.filter(v => v.size).map(v => v.size!).filter(Boolean) || ['S', 'M', 'L', 'XL'],
    category: product.category?.name || 'General',
  }));

  const handleQuickView = (productId: number) => {
    const product = bestSellingProducts.find((p) => parseInt(p.id) === productId);
    if (onQuickView && product) {
      onQuickView(product.id);
    } else if (product) {
      // Navigate to all-products page with the product selected
      navigate(`/all-products?product=${product.id}`);
    }
  };

  const handleAddToCart = async (productId: number) => {
    const product = bestSellingProducts.find((p) => parseInt(p.id) === productId);
    if (!product) return;

    // If parent component has custom add to cart logic, use it
    if (onAddToCart) {
      const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
      onAddToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        size: product.variants?.[0]?.size || 'M',
        image: primaryImage?.image_url || '/placeholder.svg'
      });
      return;
    }

    // Otherwise, use database cart
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get the first available variant or null if no variants
      const firstVariant = product.variants?.find(v => v.is_active && v.stock_quantity > 0);
      
      await addToDbCart(product.id, firstVariant?.id || null, 1);
      
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

  const handleColorSelect = (productId: number, colorIndex: number) => {
    console.log("Color selected:", productId, colorIndex);
    const product = products.find(p => p.id === productId);
    if (product && product.colors[colorIndex]) {
      console.log(`Selected ${product.colors[colorIndex].name} for ${product.name}`);
    }
  };

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#111] text-[36px] md:text-[45px] font-normal leading-[58.5px] mb-4">
              Best Selling
            </h2>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="bg-white py-16">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#111] text-[36px] md:text-[45px] font-normal leading-[58.5px] mb-4">
              Best Selling
            </h2>
            <p className="text-gray-600 text-lg">
              No best selling products available at the moment.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Admin can mark products as "Hot Sale" to display them here.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-8">
      <div className="max-w-[1920px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-[#111] text-[45px] font-normal leading-[58.5px] mb-1">
            Best Selling Products
          </h2>
          <p className="text-[#555] text-[14px] font-normal leading-[26.25px]">
            Discover our most popular garments for men and women with all size and color options available.
          </p>
        </div>

        {/* Products Grid */}
        <div className="max-w-[1890px] mx-auto">
          <ProductRow
            products={products}
            onQuickView={handleQuickView}
            onAddToCart={handleAddToCart}
            onColorSelect={handleColorSelect}
          />
        </div>
      </div>
    </section>
  );
}