import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface SocialPost {
  id: string;
  content: string;
  user: string;
  likes: number;
  created_at: string;
}

export default function InstagramFeed() {
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        // Try to fetch from a testimonials table, or create mock data based on actual products
        const { data: products, error } = await supabase
          .from('products')
          .select('name, category:categories(name)')
          .eq('is_active', true)
          .limit(8);

        if (error) {
          console.error('Error fetching products for testimonials:', error);
        } else {
          // Generate dynamic testimonials based on actual products
          const testimonials = (products || []).map((product: any, index) => ({
            id: `testimonial-${index}`,
            content: generateTestimonial(product.name, product.category?.name),
            user: `@customer${index + 1}`,
            likes: Math.floor(Math.random() * 300) + 50,
            created_at: new Date().toISOString()
          }));
          setSocialPosts(testimonials);
        }
      } catch (error) {
        console.error('Error generating testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const generateTestimonial = (productName: string, categoryName?: string) => {
    const testimonialTemplates = [
      `🌟 Just received my ${productName}! Amazing quality and perfect fit!`,
      `📦 Fast delivery on my ${productName} order. Highly recommend!`,
      `💜 Love the ${productName}! Best purchase ever!`,
      `✨ ${productName} exceeded my expectations. Will order again!`,
      `👕 ${productName} is exactly what I was looking for!`,
      `🎨 Great colors and quality on the ${productName}!`,
      `💪 Perfect for my needs - ${productName} is fantastic!`,
      `👗 ${productName} fits perfectly and looks amazing!`
    ];
    
    return testimonialTemplates[Math.floor(Math.random() * testimonialTemplates.length)];
  };

  if (loading) {
    return (
      <section className="bg-[#F8F9FA] py-16">
        <div className="max-w-[1920px] mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-[#111] text-[36px] md:text-[45px] font-normal leading-[58.5px] mb-4">
              Customer Love
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg p-4 animate-pulse h-32" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#F8F9FA] py-16">
      <div className="max-w-[1920px] mx-auto px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-[#111] text-[36px] md:text-[45px] font-normal leading-[58.5px] mb-4">
            What Our Customers Say
          </h2>
          <p className="text-[#555] text-[14px] font-normal leading-[26.25px] mb-6">
            Follow us on social media for latest updates and customer reviews
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white px-6 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200">
              Follow Us on Instagram
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200">
              Join Our Community
            </button>
          </div>
        </div>

        {/* Social Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {socialPosts.map((post, index) => (
            <div
              key={post.id}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#7C3AED] to-[#2563EB] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {post.user.charAt(1).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    {post.user}
                  </p>
                  <p className="text-gray-800 text-sm leading-relaxed mb-3">
                    {post.content}
                  </p>
                  <div className="text-xs text-gray-500">💜 {post.likes}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-[#7C3AED] to-[#2563EB] rounded-lg p-8 text-white">
            <h3 className="text-[24px] font-bold mb-2">Share Your Style!</h3>
            <p className="text-[16px] opacity-90 mb-4">
              Tag us in your photos wearing our products for a chance to be featured
            </p>
            <div className="flex justify-center space-x-4">
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm">
                #YourBrandStyle
              </span>
              <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm">
                #ComfortFashion
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}