import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload,
  Eye,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  category_id: string;
  subcategory?: string;
  price: number;
  original_price: number;
  sku: string;
  slug: string;
  is_active: boolean;
  is_hot_sale: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  category?: {
    name: string;
  };
  images: Array<{
    id: string;
    image_url: string;
    is_primary: boolean;
  }>;
  variants?: Array<{
    id: string;
    size: string | null;
    color_name: string | null;
    color_code: string | null;
    stock_quantity: number;
    is_active: boolean;
  }>;
}

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  is_active: boolean;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    revenue: 0
  });

  // Handle URL parameters for direct navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    const action = urlParams.get('action');
    
    if (tab) {
      setActiveTab(tab);
    }
    
    if (action === 'add' && tab === 'products') {
      setShowProductModal(true);
      setEditingProduct(null);
    }
  }, []);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('id', user.id)
          .eq('is_active', true)
          .single();

        if (data && !error) {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Fetch data
  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
      fetchCategories();
      fetchStats();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name),
          images:product_images(id, image_url, is_primary),
          variants:product_variants(id, size, color_name, color_code, stock_quantity, is_active)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Get product count
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Get order count
      const { count: orderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Get user count
      const { count: userCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Get revenue (sum of total_amount from orders)
      const { data: revenueData } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'paid');

      const revenue = revenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

      setStats({
        totalProducts: productCount || 0,
        totalOrders: orderCount || 0,
        totalUsers: userCount || 0,
        revenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSaveProduct = async (productData: any, images: string[]) => {
    try {
      let productId: string;
      
      // Extract color and size selections from productData
      const { selectedColors, selectedSizes, ...cleanProductData } = productData;

      if (editingProduct?.id) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(cleanProductData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        productId = editingProduct.id;
      } else {
        // Create new product
        const { data, error } = await supabase
          .from('products')
          .insert(cleanProductData)
          .select()
          .single();

        if (error) throw error;
        productId = data.id;
      }

      // Handle images
      if (images.length > 0) {
        // Delete existing images if updating
        if (editingProduct?.id) {
          await supabase
            .from('product_images')
            .delete()
            .eq('product_id', productId);
        }

        // Insert new images
        const imageInserts = images.map((imageUrl, index) => ({
          product_id: productId,
          image_url: imageUrl,
          alt_text: cleanProductData.name || 'Product image',
          sort_order: index,
          is_primary: index === 0
        }));

        const { error: imageError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imageError) throw imageError;
      }

      // Handle product variants (colors and sizes)
      if (selectedColors && selectedSizes && selectedColors.length > 0 && selectedSizes.length > 0) {
        // Delete existing variants if updating
        if (editingProduct?.id) {
          await supabase
            .from('product_variants')
            .delete()
            .eq('product_id', productId);
        }

        // Get predefined colors to find color codes
        const predefinedColors = [
          { name: 'White', code: '#FFFFFF' },
          { name: 'Black', code: '#000000' },
          { name: 'Pink', code: '#FF69B4' },
          { name: 'Lt-Green', code: '#90EE90' },
          { name: 'Navy', code: '#000080' },
          { name: 'Yellow', code: '#FFFF00' },
          { name: 'Maroon', code: '#800000' },
          { name: 'T-Blue', code: '#008B8B' },
          { name: 'Tea Rose', code: '#F4C2C2' },
          { name: 'Green', code: '#008000' },
          { name: 'Dark Rain', code: '#2F4F4F' },
          { name: 'Gray', code: '#808080' },
          { name: 'Lavender', code: '#E6E6FA' },
          { name: 'Purple', code: '#800080' },
          { name: 'Orange', code: '#FFA500' },
          { name: 'Aqua', code: '#00FFFF' },
          { name: 'Wine', code: '#722F37' },
          { name: 'Royal', code: '#4169E1' },
          { name: 'Cream', code: '#FFFDD0' },
          { name: 'Rani Pink', code: '#FF1493' },
          { name: 'Brown', code: '#A52A2A' },
          { name: 'Red', code: '#FF0000' },
          { name: 'Skin', code: '#FDBCB4' },
          { name: 'Stone', code: '#918E85' },
          { name: 'Mastered', code: '#8B4513' },
          { name: 'Gajari', code: '#FF6347' }
        ];

        // Create variants for each color/size combination
        const variantInserts = [];
        for (const colorName of selectedColors) {
          const colorInfo = predefinedColors.find(c => c.name === colorName);
          for (const size of selectedSizes) {
            variantInserts.push({
              product_id: productId,
              size: size,
              color_name: colorName,
              color_code: colorInfo?.code || '#000000',
              stock_quantity: cleanProductData.is_hot_sale ? 25 : 15, // Default stock
              price_adjustment: 0,
              is_active: true
            });
          }
        }

        if (variantInserts.length > 0) {
          const { error: variantError } = await supabase
            .from('product_variants')
            .insert(variantInserts);

          if (variantError) throw variantError;
        }
      }

      fetchProducts();
      setShowProductModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + (error as any).message);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product: ' + error.message);
    }
  };

  const toggleHotSale = async (productId: string, isHotSale: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_hot_sale: isHotSale })
        .eq('id', productId);

      if (error) throw error;
      
      // Update local state
      setProducts(products.map(product => 
        product.id === productId 
          ? { ...product, is_hot_sale: isHotSale }
          : product
      ));

      console.log(`Product ${isHotSale ? 'added to' : 'removed from'} best selling`);
    } catch (error) {
      console.error('Error updating hot sale status:', error);
      alert('Error updating product: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7C3AED] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Please log in to access the admin dashboard.</p>
          <a href="/login" className="text-[#7C3AED] hover:underline">Go to Login</a>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin dashboard.</p>
          <a href="/" className="text-[#7C3AED] hover:underline">Go to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={0} />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'dashboard' ? 'bg-[#7C3AED] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="inline w-4 h-4 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'products' ? 'bg-[#7C3AED] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Package className="inline w-4 h-4 mr-2" />
                Products
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'categories' ? 'bg-[#7C3AED] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Package className="inline w-4 h-4 mr-2" />
                Categories
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'orders' ? 'bg-[#7C3AED] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ShoppingCart className="inline w-4 h-4 mr-2" />
                Orders
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'users' ? 'bg-[#7C3AED] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="inline w-4 h-4 mr-2" />
                Users
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Package className="w-8 h-8 text-[#7C3AED]" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold">{stats.totalProducts}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <ShoppingCart className="w-8 h-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold">{stats.totalOrders}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-yellow-500" />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold">₹{stats.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Products Management</h1>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setShowProductModal(true);
                  }}
                  className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg hover:bg-[#6D28D9] transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subcategory
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Best Selling
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={product.images.find(img => img.is_primary)?.image_url || product.images[0]?.image_url || 'https://via.placeholder.com/40'}
                                alt={product.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {product.category?.name || 'No Category'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {product.subcategory || 'No Subcategory'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{product.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleHotSale(product.id, !product.is_hot_sale)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2 ${
                              product.is_hot_sale ? 'bg-[#7C3AED]' : 'bg-gray-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                product.is_hot_sale ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          {product.is_hot_sale && (
                            <span className="ml-2 text-xs text-[#7C3AED] font-medium">HOT</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setShowProductModal(true);
                            }}
                            className="text-[#7C3AED] hover:text-[#6D28D9] mr-3"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-8">Categories Management</h1>
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-600">Categories management coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-8">Orders Management</h1>
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-600">Orders management coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-8">Users Management</h1>
              <div className="bg-white p-8 rounded-lg shadow text-center">
                <p className="text-gray-600">Users management coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
        />
      )}

      <Footer />
    </div>
  );
}

// Enhanced Product Modal Component with File Upload and URL Support
interface ProductModalProps {
  product: Product | null;
  categories: Category[];
  onSave: (product: any, images: string[]) => void;
  onClose: () => void;
}

function ProductModal({ product, categories, onSave, onClose }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category_id: product?.category_id || '',
    subcategory: product?.subcategory || '',
    price: product?.price || 0,
    original_price: product?.original_price || 0,
    sku: product?.sku || '',
    slug: product?.slug || '',
    is_active: product?.is_active ?? true,
    is_hot_sale: product?.is_hot_sale ?? false,
    rating: product?.rating || 0,
  });

  const [imageUrls, setImageUrls] = useState<string[]>(
    product?.images?.map(img => img.image_url) || []
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [uploading, setUploading] = useState(false);

  // All available categories and subcategories from your catalog
  const categoryOptions = [
    {
      id: 'mens-t-shirts',
      name: "Men's T-Shirts",
      subcategories: [
        "Round Neck",
        "V-Neck", 
        "Polo (Collar)",
        "Long Sleeve",
        "Sleeveless",
        "Full Hand"
      ]
    },
    {
      id: 'mens-bottomwear',
      name: "Men's Bottomwear",
      subcategories: [
        "Track Pants",
        "Shorts"
      ]
    },
    {
      id: 'womens-leggings',
      name: "Women's Leggings",
      subcategories: [
        "Flat Ankle",
        "Full Length",
        "Churidhar Ankle",
        "Churidhar Full Length",
        "Shimmer",
        "3/4 Length"
      ]
    },
    {
      id: 'womens-sarees-shapewear',
      name: "Women's Sarees & Shapewear",
      subcategories: [
        "Lycra Cotton",
        "Polyester",
        "Shimmer"
      ]
    },
    {
      id: 'womens-night-wear',
      name: "Women's Night Wear",
      subcategories: [
        "Night T-Shirt (Top)",
        "3/4 Leggings (Night)",
        "Shorts (Night)"
      ]
    },
    {
      id: 'womens-innerwear',
      name: "Women's Innerwear",
      subcategories: [
        "Basic Slips",
        "Adjustment Slips",
        "Panties"
      ]
    }
  ];

  // All available sizes based on category
  const getSizesForCategory = (categorySlug: string) => {
    const sizeMap: { [key: string]: string[] } = {
      'mens-t-shirts': ['S', 'M', 'L', 'XL', 'XXL'],
      'mens-bottomwear': ['M', 'L', 'XL', 'XXL'],
      'womens-leggings': ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'],
      'womens-sarees-shapewear': ['S', 'M', 'L', 'XL', 'XXL'],
      'womens-night-wear': ['S', 'M', 'L', 'XL', 'XXL'],
      'womens-innerwear': ['S', 'M', 'L', 'XL', 'XXL']
    };
    return sizeMap[categorySlug] || ['S', 'M', 'L', 'XL', 'XXL'];
  };

  // All available colors from your catalog
  const predefinedColors = [
    { name: 'White', code: '#FFFFFF' },
    { name: 'Black', code: '#000000' },
    { name: 'Pink', code: '#FF69B4' },
    { name: 'Lt-Green', code: '#90EE90' },
    { name: 'Navy', code: '#000080' },
    { name: 'Yellow', code: '#FFFF00' },
    { name: 'Maroon', code: '#800000' },
    { name: 'T-Blue', code: '#008B8B' },
    { name: 'Tea Rose', code: '#F4C2C2' },
    { name: 'Green', code: '#008000' },
    { name: 'Dark Rain', code: '#2F4F4F' },
    { name: 'Gray', code: '#808080' },
    { name: 'Lavender', code: '#E6E6FA' },
    { name: 'Purple', code: '#800080' },
    { name: 'Orange', code: '#FFA500' },
    { name: 'Aqua', code: '#00FFFF' },
    { name: 'Wine', code: '#722F37' },
    { name: 'Royal', code: '#4169E1' },
    { name: 'Cream', code: '#FFFDD0' },
    { name: 'Rani Pink', code: '#FF1493' },
    { name: 'Brown', code: '#A52A2A' },
    { name: 'Red', code: '#FF0000' },
    { name: 'Skin', code: '#FDBCB4' },
    { name: 'Stone', code: '#918E85' },
    { name: 'Mastered', code: '#8B4513' },
    { name: 'Gajari', code: '#FF6347' }
  ];

  // Color variants management - now with predefined colors
  const [selectedColors, setSelectedColors] = useState<string[]>(['Black']);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [newColorName, setNewColorName] = useState('');
  const [newColorCode, setNewColorCode] = useState('#000000');

  // Initialize colors and sizes from existing product variants when editing
  useEffect(() => {
    if (product && product.variants) {
      const existingColors = [...new Set(product.variants.map(v => v.color_name).filter(Boolean))] as string[];
      const existingSizes = [...new Set(product.variants.map(v => v.size).filter(Boolean))] as string[];
      
      if (existingColors.length > 0) {
        setSelectedColors(existingColors);
      }
      if (existingSizes.length > 0) {
        setSelectedSizes(existingSizes);
      }
    }
  }, [product]);

  // Update sizes when category changes
  const handleCategoryChange = (categoryId: string) => {
    setFormData({ ...formData, category_id: categoryId });
    const categorySlug = categoryOptions.find(cat => 
      categories.find(c => c.id === categoryId)?.slug === cat.id
    )?.id;
    if (categorySlug) {
      setSelectedSizes(getSizesForCategory(categorySlug));
    }
  };

  const addColorVariant = () => {
    if (newColorName.trim() && !selectedColors.includes(newColorName.trim())) {
      setSelectedColors([...selectedColors, newColorName.trim()]);
      setNewColorName('');
      setNewColorCode('#000000');
    }
  };

  const removeColorVariant = (colorName: string) => {
    setSelectedColors(selectedColors.filter(color => color !== colorName));
  };

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const togglePredefinedColor = (colorName: string) => {
    if (selectedColors.includes(colorName)) {
      setSelectedColors(selectedColors.filter(c => c !== colorName));
    } else {
      setSelectedColors([...selectedColors, colorName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate slug from name if not provided
    if (!formData.slug) {
      formData.slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    
    // Save the product first
    onSave(formData, imageUrls);
    
    // After saving the product, we need to create variants for each color/size combination
    // This will need to be handled in the parent component's onSave function
    // For now, we'll pass the selected colors and sizes as part of the form data
    const productWithVariants = {
      ...formData,
      selectedColors,
      selectedSizes
    };
    
    onSave(productWithVariants, imageUrls);
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Upload to Supabase Storage - Fixed path issue
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Upload error:', error);
          alert(`Failed to upload ${file.name}: ${error.message}`);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }

      // Add uploaded URLs to the list
      if (uploadedUrls.length > 0) {
        setImageUrls(prev => [...prev, ...uploadedUrls]);
      }

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const removeImage = async (index: number) => {
    const imageUrl = imageUrls[index];
    
    // If it's a Supabase storage URL, delete from storage
    if (imageUrl.includes('supabase') && imageUrl.includes('product-images')) {
      try {
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        await supabase.storage
          .from('product-images')
          .remove([fileName]);
      } catch (error) {
        console.error('Error deleting image from storage:', error);
      }
    }
    
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...imageUrls];
    if (direction === 'up' && index > 0) {
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    setImageUrls(newImages);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Product Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Field */}
              {formData.category_id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subcategory *
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    required
                  >
                    <option value="">Select Subcategory</option>
                    {(() => {
                      const selectedCategory = categories.find(c => c.id === formData.category_id);
                      const categoryOption = categoryOptions.find(opt => opt.id === selectedCategory?.slug);
                      return categoryOption?.subcategories.map((subcategory, index) => (
                        <option key={index} value={subcategory}>
                          {subcategory}
                        </option>
                      )) || [];
                    })()}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Select the specific subcategory for this product (e.g., for T-Shirts: Round Neck, V-Neck, etc.)
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="mr-2"
                  />
                  Active
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_hot_sale}
                    onChange={(e) => setFormData({ ...formData, is_hot_sale: e.target.checked })}
                    className="mr-2"
                  />
                  Hot Sale
                </label>
              </div>

              {/* Color Selection Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Available Colors
                </label>
                
                {/* Predefined Colors Grid */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {predefinedColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => togglePredefinedColor(color.name)}
                      className={`flex items-center gap-2 p-2 text-xs rounded-lg border transition-colors ${
                        selectedColors.includes(color.name)
                          ? 'border-[#7C3AED] bg-purple-50 text-[#7C3AED]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.code }}
                      ></div>
                      <span className="truncate">{color.name}</span>
                    </button>
                  ))}
                </div>

                {/* Add Custom Color */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Custom color name"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                  />
                  <input
                    type="color"
                    value={newColorCode}
                    onChange={(e) => setNewColorCode(e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                  <button
                    type="button"
                    onClick={addColorVariant}
                    className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Selected Colors Display */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Selected Colors ({selectedColors.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedColors.map((colorName) => {
                      const colorInfo = predefinedColors.find(c => c.name === colorName);
                      return (
                        <div key={colorName} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                          <div
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: colorInfo?.code || '#000000' }}
                          ></div>
                          <span className="text-sm">{colorName}</span>
                          <button
                            type="button"
                            onClick={() => removeColorVariant(colorName)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Size Selection Section */}
              {formData.category_id && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Available Sizes
                  </label>
                  
                  {(() => {
                    const selectedCategory = categories.find(c => c.id === formData.category_id);
                    const categoryOption = categoryOptions.find(opt => opt.id === selectedCategory?.slug);
                    const availableSizes = categoryOption ? getSizesForCategory(categoryOption.id) : ['S', 'M', 'L', 'XL', 'XXL'];
                    
                    return (
                      <>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {availableSizes.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => toggleSize(size)}
                              className={`p-2 text-sm font-medium rounded-lg border transition-colors ${
                                selectedSizes.includes(size)
                                  ? 'border-[#7C3AED] bg-purple-50 text-[#7C3AED]'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Selected Sizes ({selectedSizes.length}):</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedSizes.map((size) => (
                              <span key={size} className="bg-purple-100 text-[#7C3AED] px-2 py-1 rounded text-sm font-medium">
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Right Column - Product Images */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Product Images
                </label>
                
                {/* Upload Method Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('url')}
                    className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      uploadMethod === 'url'
                        ? 'bg-white text-[#7C3AED] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Add URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod('file')}
                    className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      uploadMethod === 'file'
                        ? 'bg-white text-[#7C3AED] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </button>
                </div>

                {/* URL Input Method */}
                {uploadMethod === 'url' && (
                  <div className="flex gap-2 mb-4">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Enter image URL"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                    <button
                      type="button"
                      onClick={addImageUrl}
                      disabled={!newImageUrl.trim()}
                      className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* File Upload Method */}
                {uploadMethod === 'file' && (
                  <div className="mb-4">
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                          uploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {uploading ? (
                          <div className="flex flex-col items-center">
                            <Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin mb-2" />
                            <p className="text-sm text-gray-600">Uploading images...</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-[#7C3AED]">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                )}

                {/* Image List */}
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/64?text=Error';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 truncate">{url}</p>
                        {index === 0 && (
                          <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Primary Image
                          </span>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveImage(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(index, 'down')}
                          disabled={index === imageUrls.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1 text-red-400 hover:text-red-600"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {imageUrls.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No images added yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Add images using URLs or upload files from your device
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}