import { HeroBannerCarousel } from "./ui/carousel-nav";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface BannerSlide {
  id: string;
  image: string;
  alt: string;
  title?: string;
  description?: string;
}

export default function HeroBanner() {
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBannerImages = async () => {
      try {
        // Try to fetch featured product images for the banner
        const { data: products, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            images:product_images(image_url, is_primary)
          `)
          .eq('is_active', true)
          .eq('is_hot_sale', true)
          .limit(3);

        if (error) {
          console.error('Error fetching banner images:', error);
        } else {
          const slides = (products || []).map((product: any, index) => {
            const primaryImage = product.images?.find((img: any) => img.is_primary) || product.images?.[0];
            return {
              id: product.id,
              image: primaryImage?.image_url || '/placeholder.svg',
              alt: `${product.name} - Featured Product`,
              title: product.name,
              description: "Premium Quality Garments"
            };
          });

          // If we don't have enough slides, add placeholder ones
          while (slides.length < 3) {
            slides.push({
              id: `placeholder-${slides.length}`,
              image: '/placeholder.svg',
              alt: `Hero Banner ${slides.length + 1}`,
              title: "Premium Collection",
              description: "Discover our latest products"
            });
          }

          setBannerSlides(slides);
        }
      } catch (error) {
        console.error('Error fetching banner data:', error);
        // Fallback to default slides
        setBannerSlides([
          {
            id: "default-1",
            image: '/placeholder.svg',
            alt: "Hero Banner 1",
            title: "Premium Collection",
            description: "Discover our latest products"
          },
          {
            id: "default-2", 
            image: '/placeholder.svg',
            alt: "Hero Banner 2",
            title: "Quality Garments",
            description: "For men and women"
          },
          {
            id: "default-3",
            image: '/placeholder.svg', 
            alt: "Hero Banner 3",
            title: "Shop Now",
            description: "Best prices guaranteed"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBannerImages();
  }, []);

  const desktopSlideElements = bannerSlides.map((slide, index) => (
    <div
      key={slide.id}
      className="relative h-[600px] md:h-[800px] overflow-hidden"
    >
      <img
        src={slide.image}
        alt={slide.alt}
        className="w-full h-full object-cover"
      />
      {/* Overlay with content */}
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
        <div className="text-center text-white px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h2>
          <p className="text-lg md:text-xl mb-6">{slide.description}</p>
          <button className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-all duration-200">
            SHOP NOW
          </button>
        </div>
      </div>
    </div>
  ));

  if (loading) {
    return (
      <section className="relative w-full">
        <div className="h-[400px] md:h-[800px] bg-gray-200 animate-pulse" />
      </section>
    );
  }

  return (
    <section className="relative w-full">
      {/* Mobile Hero Banner */}
      <div className="md:hidden relative h-[400px] overflow-hidden bg-gradient-to-r from-[#7C3AED] to-[#2563EB]">
        {/* Mobile Content */}
        <div className="flex items-center justify-center h-full">
          <div className="text-center px-6 py-8">
            <p className="text-white text-[14px] font-normal leading-relaxed mb-2">
              Premium Quality Garments for
            </p>
            <h1 className="text-white text-[32px] font-bold leading-tight mb-6">
              Men & Women
            </h1>
            <button className="bg-white text-[#7C3AED] hover:bg-gray-100 px-6 py-3 rounded text-[14px] font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
              SHOP NOW
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Hero Banner */}
      <div className="hidden md:block h-[600px] bg-gradient-to-r from-[#7C3AED] to-[#2563EB]">
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white">
            <h1 className="text-[48px] font-bold leading-tight mb-4">
              Premium Garments Collection
            </h1>
            <p className="text-[18px] font-normal leading-relaxed mb-8">
              Discover our range of T-Shirts, Leggings, Shapewear, Night Wear & More
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-white text-[#7C3AED] hover:bg-gray-100 px-8 py-4 rounded text-[16px] font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
                SHOP MEN'S
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#7C3AED] px-8 py-4 rounded text-[16px] font-semibold transition-all duration-200">
                SHOP WOMEN'S
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}