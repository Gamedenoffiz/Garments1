import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category_id: string | null;
  subcategory: string | null;
  price: number;
  original_price: number | null;
  sku: string | null;
  slug: string;
  is_active: boolean;
  is_hot_sale: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  category?: {
    name: string;
    slug: string;
  };
  images: Array<{
    id: string;
    image_url: string;
    alt_text: string | null;
    is_primary: boolean;
    sort_order: number;
  }>;
  variants: Array<{
    id: string;
    size: string | null;
    color_name: string | null;
    color_code: string | null;
    stock_quantity: number;
    price_adjustment: number;
    is_active: boolean;
  }>;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          category:categories(name, slug),
          images:product_images(*),
          variants:product_variants(*)
        `,
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      console.error("Database fetch failed, using mock data:", errorMessage);
      setError(errorMessage);

      // Fallback to mock data when database connection fails
      const mockProducts: Product[] = [
        {
          id: "1",
          name: "Men's Round Neck T-Shirt - Premium Cotton",
          description:
            "Premium quality round neck t-shirt made from 100% cotton",
          category_id: "1",
          subcategory: "Round Neck T-Shirts",
          price: 399,
          original_price: 499,
          sku: "MEN-RN-TSH-001",
          slug: "mens-round-neck-tshirt-premium",
          is_active: true,
          is_hot_sale: true,
          rating: 5,
          review_count: 45,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: { name: "Men", slug: "men" },
          images: [
            {
              id: "1",
              image_url: "/placeholder.svg",
              alt_text: "Round Neck T-Shirt",
              is_primary: true,
              sort_order: 1,
            },
          ],
          variants: [
            {
              id: "1",
              size: "M",
              color_name: "Black",
              color_code: "#000000",
              stock_quantity: 50,
              price_adjustment: 0,
              is_active: true,
            },
          ],
        },
        {
          id: "2",
          name: "Women's 3/4 Leggings - Comfort Fit",
          description:
            "Comfortable 3/4 length leggings perfect for workouts and casual wear",
          category_id: "2",
          subcategory: "3/4 Leggings",
          price: 449,
          original_price: 549,
          sku: "WOM-34-LEG-001",
          slug: "womens-3-4-leggings-comfort",
          is_active: true,
          is_hot_sale: true,
          rating: 4,
          review_count: 28,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: { name: "Women", slug: "women" },
          images: [
            {
              id: "2",
              image_url: "/placeholder.svg",
              alt_text: "3/4 Leggings",
              is_primary: true,
              sort_order: 1,
            },
          ],
          variants: [
            {
              id: "2",
              size: "M",
              color_name: "Navy",
              color_code: "#000080",
              stock_quantity: 30,
              price_adjustment: 0,
              is_active: true,
            },
          ],
        },
        {
          id: "3",
          name: "Men's V-Neck T-Shirt - Classic Style",
          description:
            "Stylish V-neck t-shirt crafted from premium cotton blend",
          category_id: "1",
          subcategory: "V-Neck T-Shirts",
          price: 449,
          original_price: 549,
          sku: "MEN-VN-TSH-002",
          slug: "mens-v-neck-tshirt-classic",
          is_active: true,
          is_hot_sale: false,
          rating: 4,
          review_count: 32,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category: { name: "Men", slug: "men" },
          images: [
            {
              id: "3",
              image_url: "/placeholder.svg",
              alt_text: "V-Neck T-Shirt",
              is_primary: true,
              sort_order: 1,
            },
          ],
          variants: [
            {
              id: "3",
              size: "L",
              color_name: "Purple",
              color_code: "#7C3AED",
              stock_quantity: 25,
              price_adjustment: 0,
              is_active: true,
            },
          ],
        },
      ];

      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const getProductBySlug = async (slug: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          category:categories(name, slug),
          images:product_images(*),
          variants:product_variants(*)
        `,
        )
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching product:", err);
      return null;
    }
  };

  const getProductsByCategory = async (
    categorySlug: string,
  ): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          category:categories!inner(name, slug),
          images:product_images(*),
          variants:product_variants(*)
        `,
        )
        .eq("category.slug", categorySlug)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error fetching products by category:", err);
      return [];
    }
  };

  const getHotSaleProducts = async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          category:categories(name, slug),
          images:product_images(*),
          variants:product_variants(*)
        `,
        )
        .eq("is_hot_sale", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error(
        "Error fetching hot sale products:",
        err instanceof Error ? err.message : String(err),
      );
      return [];
    }
  };

  const getAllProducts = async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          category:categories(name, slug),
          images:product_images(*),
          variants:product_variants(*)
        `,
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error fetching all products:", err);
      return [];
    }
  };

  const getRelatedProducts = async (
    categoryId: string,
    excludeProductId: string,
    limit: number = 4,
  ): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          category:categories(name, slug),
          images:product_images(*),
          variants:product_variants(*)
        `,
        )
        .eq("category_id", categoryId)
        .neq("id", excludeProductId)
        .eq("is_active", true)
        .limit(limit)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error fetching related products:", err);
      return [];
    }
  };

  const getRecommendedProducts = async (
    limit: number = 6,
  ): Promise<Product[]> => {
    try {
      // Get a mix of hot sale and popular products for recommendations
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          category:categories(name, slug),
          images:product_images(*),
          variants:product_variants(*)
        `,
        )
        .eq("is_active", true)
        .or("is_hot_sale.eq.true,rating.gte.4")
        .limit(limit)
        .order("rating", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error("Error fetching recommended products:", err);
      return [];
    }
  };

  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          category:categories(name, slug),
          images:product_images(*),
          variants:product_variants(*)
        `,
        )
        .eq("id", id)
        .eq("is_active", true)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching product by id:", err);
      return null;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    getProductBySlug,
    getProductsByCategory,
    getHotSaleProducts,
    getAllProducts,
    getRelatedProducts,
    getRecommendedProducts,
    getProductById,
  };
}
