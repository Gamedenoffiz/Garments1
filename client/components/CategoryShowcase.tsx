import { ShopNowButton } from "./ui/enhanced-button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  _count?: {
    products: number;
  };
}

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select(`
            *,
            products!inner(id)
          `)
          .eq('is_active', true)
          .limit(6);

        if (error) {
          console.error('Error fetching categories:', error);
        } else {
          // Group by category to count products
          const categoryMap = new Map();
          data?.forEach(item => {
            if (!categoryMap.has(item.id)) {
              categoryMap.set(item.id, {
                ...item,
                _count: { products: 0 }
              });
            }
            categoryMap.get(item.id)._count.products++;
          });
          
          setCategories(Array.from(categoryMap.values()));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Category display configuration
  const categoryConfig = [
    {
      slug: "mens-t-shirts",
      title: "Men's Collection",
      subtitle: "T-Shirts, Track Pants & More", 
      gradient: "from-blue-500 to-blue-700",
      icon: "👔",
      description: "Premium quality men's wear including round neck, V-neck, polo t-shirts, track pants and shorts in all sizes."
    },
    {
      slug: "womens-leggings",
      title: "Women's Collection",
      subtitle: "Leggings, Shapewear & Night Wear",
      gradient: "from-purple-500 to-pink-500", 
      icon: "👗",
      description: "Complete range of women's clothing including leggings, shapewear, night wear in multiple colors and sizes."
    },
    {
      slug: "hot-sale",
      title: "Hot Sales",
      subtitle: "Limited Time Offers",
      gradient: "from-red-500 to-orange-500",
      icon: "🔥", 
      description: "Don't miss out on our special deals and discounts on selected items."
    }
  ];

  const displayCategories = categoryConfig.map(config => {
    const dbCategory = categories.find(cat => cat.slug === config.slug);
    return {
      ...config,
      href: `/products/${config.slug}`,
      productCount: dbCategory?._count?.products || 0,
      isActive: !!dbCategory
    };
  });

  if (loading) {
    return (
      <section className="bg-white py-3">
        <div className="w-full max-w-[1925px] mx-auto px-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map((i) => (
              <div key={i} className="h-[400px] md:h-[500px] bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-3">
      <div className="w-full max-w-[1925px] mx-auto px-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayCategories.map((category, index) => (
            <Link
              key={index}
              to={category.href}
              className={`relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ${!category.isActive ? 'opacity-75' : ''}`}
            >
              {/* Gradient Background */}
              <div
                className={`relative h-[400px] md:h-[500px] bg-gradient-to-br ${category.gradient}`}
              >
                {/* Content */}
                <div className="flex items-center justify-center h-full">
                  <div className="text-center px-8 py-8 text-white">
                    <div className="text-6xl mb-4">{category.icon}</div>
                    <h3 className="font-bold text-[28px] md:text-[32px] leading-[41.6px] mb-2">
                      {category.title}
                    </h3>
                    <p className="font-normal text-[16px] md:text-[18px] mb-4 opacity-90">
                      {category.subtitle}
                    </p>
                    <p className="font-normal text-[14px] mb-6 opacity-80 max-w-xs mx-auto">
                      {category.description}
                    </p>
                    {category.productCount > 0 && (
                      <p className="text-xs opacity-80 mb-4">
                        {category.productCount} products available
                      </p>
                    )}
                    <button
                      className="bg-white text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-all duration-200 group-hover:scale-105"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}