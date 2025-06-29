import React, { useState, useEffect } from "react";
import { Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import { useProducts, Product } from "../hooks/useProducts";
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

export default function CartPage() {
  const { user } = useAuth();
  const { cartItems: dbCartItems, addToCart, updateQuantity, removeFromCart, getCartTotal, loading: cartLoading } = useCart();
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderNote, setOrderNote] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const { getRecommendedProducts } = useProducts();

  // Convert database cart items to the format expected by the component
  const cartItems: CartItem[] = dbCartItems.map(item => ({
    id: item.id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    size: item.variant?.size || 'N/A',
    image: item.product.images.find(img => img.is_primary)?.image_url || '/placeholder.svg'
  }));

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      setLoading(true);
      const products = await getRecommendedProducts(6);
      setRecommendedProducts(products);
      setLoading(false);
    };

    fetchRecommendedProducts();
  }, [getRecommendedProducts]);

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemoveItem(id);
      return;
    }
    try {
      await updateQuantity(id, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await removeFromCart(id);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      // For recommended products, add without specific variant
      await addToCart(product.id, undefined, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const subtotal = getCartTotal();

  const onCartToggle = () => {};
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white">
      <PromoBanner />
      <Header onCartToggle={onCartToggle} cartCount={cartCount} />

      <main className="flex-1">
        <div className="flex flex-col items-center">
          {/* Page Title and Breadcrumb */}
          <div className="flex flex-col items-center gap-2 pt-[59px] pb-[59px] w-full">
            <h1 className="text-[45px] font-normal text-center text-black font-['Jost'] leading-[58.5px] capitalize">
              Your cart
            </h1>
            <nav className="flex items-center gap-2 text-sm">
              <Link
                to="/"
                className="text-black font-['Inter'] text-[14px] leading-[26px]"
              >
                Home
              </Link>
              <span className="text-[#555] font-['Inter'] text-[15px] leading-[26px]">
                /
              </span>
              <span className="text-[#555] font-['Inter'] text-[14px] leading-[26px]">
                Your Shopping Cart
              </span>
            </nav>
          </div>

          <div className="w-full max-w-[1320px] px-4">
            <div className="flex justify-center">
              <div className="w-full max-w-[1290px] pt-[50px] px-4">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                  {/* Cart Items Section */}
                  <div className="w-full lg:w-[882px] pb-8">
                    <div className="flex flex-col gap-8">
                      {/* Cart Items Table */}
                      {cartItems.length === 0 ? (
                        <div className="border border-[#EBEBEB] rounded-sm p-12 text-center">
                          <p className="text-[#555] font-['Inter'] text-[16px] mb-4">
                            Your cart is empty
                          </p>
                          <Link
                            to="/"
                            className="inline-block bg-black text-white px-8 py-3 rounded-[30px] font-['Inter'] text-[12px] font-semibold uppercase hover:bg-gray-800 transition-colors"
                          >
                            Continue Shopping
                          </Link>
                        </div>
                      ) : (
                        <div className="border border-[#EBEBEB] rounded-sm overflow-hidden">
                          {/* Table Header - Hidden on mobile */}
                          <div className="hidden md:flex h-[47.5px] bg-white border-b border-[#EBEBEB]">
                            <div className="flex-1 px-[21px] py-[14px] border-r border-[#EBEBEB]">
                              <span className="text-black font-['Inter'] text-[13px] font-medium leading-[21px]">
                                Product
                              </span>
                            </div>
                            <div className="w-[201px] px-[21px] py-[14px] border-r border-[#EBEBEB]">
                              <span className="text-black font-['Inter'] text-[13px] font-medium leading-[21px]">
                                Quantity
                              </span>
                            </div>
                            <div className="w-[156px] px-[21px] py-[14px] border-r border-[#EBEBEB]">
                              <span className="text-black font-['Inter'] text-[13px] font-medium leading-[21px]">
                                Total
                              </span>
                            </div>
                            <div className="w-[54px]"></div>
                          </div>

                          {/* Cart Items */}
                          {cartItems.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col md:flex-row md:h-[147px] border-b border-[#EBEBEB] last:border-b-0 p-4 md:p-0"
                            >
                              {/* Mobile Layout */}
                              <div className="flex md:hidden gap-4">
                                <div className="w-[79px] h-[106px] bg-white rounded-md overflow-hidden flex-shrink-0">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 space-y-3">
                                  <h3 className="text-black font-['Jost'] text-[15px] font-medium leading-[19.5px]">
                                    {item.name}
                                  </h3>
                                  <div className="text-[#555] font-['Inter'] text-[14px] leading-[19.6px]">
                                    Size: {item.size}
                                  </div>
                                  <div className="text-[#555] font-['Inter'] text-[14px] leading-[19.6px]">
                                    Rs. {item.price.toLocaleString()}.00
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center border border-[#EBEBEB] rounded-md bg-[#F5F5F5] p-1">
                                      <button
                                        onClick={() =>
                                          handleUpdateQuantity(
                                            item.id,
                                            item.quantity - 1,
                                          )
                                        }
                                        className="w-[30px] h-[30px] flex items-center justify-center hover:bg-white rounded transition-colors"
                                      >
                                        <Minus className="w-3 h-3 text-black" />
                                      </button>
                                      <div className="w-[40px] h-[30px] flex items-center justify-center text-[#555] font-['Inter'] text-[13px]">
                                        {item.quantity}
                                      </div>
                                      <button
                                        onClick={() =>
                                          handleUpdateQuantity(
                                            item.id,
                                            item.quantity + 1,
                                          )
                                        }
                                        className="w-[30px] h-[30px] flex items-center justify-center hover:bg-white rounded transition-colors"
                                      >
                                        <Plus className="w-3 h-3 text-black" />
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="text-black font-['Inter'] text-[15px] font-medium">
                                        Rs.{" "}
                                        {(
                                          item.price * item.quantity
                                        ).toLocaleString()}
                                        .00
                                      </span>
                                      <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="p-2 text-[#555] hover:text-black transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Desktop Layout */}
                              <div className="hidden md:flex w-full">
                                {/* Product Image */}
                                <div className="w-[120px] min-w-[120px] p-[21px] border-r border-[#EBEBEB]">
                                  <div className="w-[79px] h-[106px] bg-white rounded-md overflow-hidden">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>

                                {/* Product Details */}
                                <div className="flex-1 px-[21px] py-[39px] border-r border-[#EBEBEB] flex flex-col gap-2">
                                  <h3 className="text-black font-['Jost'] text-[15px] font-medium leading-[19.5px]">
                                    {item.name}
                                  </h3>
                                  <div className="text-[#555] font-['Inter'] text-[14px] leading-[19.6px]">
                                    {item.size}
                                  </div>
                                  <div className="text-[#555] font-['Inter'] text-[14px] leading-[19.6px] mt-2">
                                    Rs. {item.price.toLocaleString()}.00
                                  </div>
                                </div>

                                {/* Quantity Controls */}
                                <div className="w-[201px] px-[21px] py-[45px] border-r border-[#EBEBEB]">
                                  <div className="flex items-center border border-[#EBEBEB] rounded-md bg-[#F5F5F5] p-1">
                                    <button
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          item.id,
                                          item.quantity - 1,
                                        )
                                      }
                                      className="w-[35px] h-[35px] flex items-center justify-center hover:bg-white rounded transition-colors"
                                    >
                                      <Minus className="w-3 h-3 text-black" />
                                    </button>
                                    <div className="flex-1 h-[35px] flex items-center justify-center text-[#555] font-['Inter'] text-[13px]">
                                      {item.quantity}
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleUpdateQuantity(
                                          item.id,
                                          item.quantity + 1,
                                        )
                                      }
                                      className="w-[35px] h-[35px] flex items-center justify-center hover:bg-white rounded transition-colors"
                                    >
                                      <Plus className="w-3 h-3 text-black" />
                                    </button>
                                  </div>
                                </div>

                                {/* Item Total */}
                                <div className="w-[156px] px-[21px] py-[63px] border-r border-[#EBEBEB]">
                                  <span className="text-black font-['Inter'] text-[13px] font-medium leading-[19.6px]">
                                    Rs.{" "}
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString()}
                                    .00
                                  </span>
                                </div>

                                {/* Remove Button */}
                                <div className="w-[54px] px-[11px] py-[66px] flex items-center justify-center">
                                  <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="w-[14px] h-[14px] flex items-center justify-center text-[#555] hover:text-black transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* You may also like */}
                      <div className="pt-[35px]">
                        <h2 className="text-black font-['Jost'] text-[20px] font-medium leading-[26px] mb-4">
                          You may also like
                        </h2>
                        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
                          {loading ? (
                            // Loading skeleton
                            [...Array(3)].map((_, index) => (
                              <div key={index} className="flex-shrink-0 w-[300px] md:w-[431px] border border-[#EBEBEB] rounded-[10px] p-3 animate-pulse">
                                <div className="flex gap-4">
                                  <div className="w-[85px] h-[113px] bg-gray-200 rounded-md"></div>
                                  <div className="flex-1 flex flex-col gap-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/3 mt-2"></div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            recommendedProducts.map((product) => {
                              const primaryImage = product.images.find(img => img.is_primary) || product.images[0];
                              return (
                                <div
                                  key={product.id}
                                  className="flex-shrink-0 w-[300px] md:w-[431px] border border-[#EBEBEB] rounded-[10px] p-3"
                                >
                                  <div className="flex gap-4">
                                    <div className="w-[85px] h-[113px] rounded-md overflow-hidden">
                                      <img
                                        src={primaryImage?.image_url || '/placeholder.svg'}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                      <h3 className="text-black font-['Jost'] text-[15px] leading-[19.5px]">
                                        {product.name}
                                      </h3>
                                      <div className="text-black font-['Inter'] text-[14px] font-medium leading-[24.5px]">
                                        Rs. {product.price.toLocaleString()}.00
                                      </div>
                                      <button
                                        onClick={() => handleAddToCart(product)}
                                        className="text-black font-['Inter'] text-[11px] font-semibold leading-[21px] uppercase border-b-2 border-black self-start mt-2 hover:opacity-70 transition-opacity"
                                      >
                                        Add to Cart
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Pagination dots */}
                        <div className="flex justify-center gap-2 mt-4">
                          <div className="w-2 h-2 rounded-full bg-black"></div>
                          <div className="w-2 h-2 rounded-full bg-black opacity-20"></div>
                          <div className="w-2 h-2 rounded-full bg-black opacity-20"></div>
                          <div className="w-2 h-2 rounded-full bg-black opacity-20"></div>
                          <div className="w-2 h-2 rounded-full bg-black opacity-20"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cart Summary Sidebar */}
                  <div className="w-full lg:w-[378px]">
                    <div className="bg-[#F5F5F5] rounded-md p-4 md:p-8 w-full lg:max-w-[370px]">
                      {/* Free shipping progress */}
                      <div className="mb-8 pb-6 border-b border-[#DEDEDE]">
                        <div className="relative mb-3">
                          <div className="h-[5px] bg-[#DEDEDE] rounded-md">
                            <div className="h-full bg-gradient-to-r from-[#DD3327] to-[#DD3327] rounded-md relative">
                              <div className="absolute right-0 top-[-13px] w-[30px] h-[30px] bg-white border border-[#DD3327] rounded-full flex items-center justify-center">
                                <div className="w-5 h-3 text-[#DD3327]">
                                  <svg viewBox="0 0 20 15" fill="currentColor">
                                    <path d="M18.8015 6.69106L17.711 5.67954C17.6367 5.6106 17.5796 5.52508 17.5446 5.42993L16.6882 3.10452C16.5657 2.7768 16.3463 2.49419 16.0591 2.29434C15.772 2.0945 15.4307 1.98693 15.0809 1.98596H13.7833V1.62195C13.7833 1.46541 13.7212 1.31528 13.6105 1.20459C13.4998 1.0939 13.3496 1.03171 13.1931 1.03171H5.35161C5.23493 1.03033 5.12232 1.07452 5.03771 1.15487C4.9531 1.23522 4.90316 1.3454 4.89851 1.46199C4.89743 1.52027 4.90796 1.57818 4.92951 1.63234C4.95106 1.6865 4.98319 1.73583 5.02402 1.77743C5.06485 1.81903 5.11356 1.85208 5.16731 1.87464C5.22106 1.8972 5.27876 1.90882 5.33705 1.90882H12.9062V5.71438C12.9062 5.87092 12.9684 6.02105 13.0791 6.13174C13.1898 6.24244 13.3399 6.30462 13.4964 6.30462H17.061L18.1197 7.25736V10.8113H17.1599C17.0643 10.3931 16.8296 10.0197 16.4942 9.75232C16.1587 9.48489 15.7424 9.33926 15.3134 9.33926C14.8845 9.33926 14.4682 9.48489 14.1327 9.75232C13.7973 10.0197 13.5626 10.3931 13.467 10.8113H10.5136C10.4181 10.3931 10.1833 10.0197 9.84791 9.75232C9.51247 9.48489 9.09619 9.33926 8.66719 9.33926C8.2382 9.33926 7.82191 9.48489 7.48648 9.75232C7.15104 10.0197 6.91633 10.3931 6.82075 10.8113H5.35157C5.23488 10.8099 5.12226 10.8541 5.03765 10.9345C4.95305 11.0149 4.90313 11.1251 4.89851 11.2417C4.89743 11.3 4.90796 11.3579 4.92951 11.412C4.95106 11.4662 4.98319 11.5155 5.02402 11.5571C5.06485 11.5987 5.11357 11.6318 5.16731 11.6543C5.22106 11.6769 5.27876 11.6885 5.33705 11.6885H6.82814C6.92972 12.0994 7.16602 12.4645 7.49933 12.7255C7.83265 12.9864 8.24376 13.1282 8.66707 13.1282C9.09038 13.1282 9.5015 12.9864 9.83481 12.7255C10.1681 12.4645 10.4044 12.0994 10.506 11.6885H13.4745C13.576 12.0994 13.8123 12.4645 14.1457 12.7255C14.479 12.9864 14.8901 13.1282 15.3134 13.1282C15.7367 13.1282 16.1478 12.9864 16.4811 12.7255C16.8144 12.4645 17.0507 12.0994 17.1523 11.6885H18.4066C18.5631 11.6885 18.7133 11.6263 18.824 11.5156C18.9346 11.405 18.9968 11.2548 18.9968 11.0983V7.12974C18.9968 7.04702 18.9794 6.96523 18.9457 6.88967C18.9121 6.81411 18.8629 6.74644 18.8015 6.69106Z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-black font-['Inter'] text-[13px] leading-[24.5px]">
                          Congratulations! You've got free shipping!
                        </p>
                      </div>

                      {/* Order Note */}
                      <div className="mb-8">
                        <label className="block text-black font-['Inter'] text-[14px] font-medium leading-[26px] capitalize mb-4">
                          Add order note
                        </label>
                        <textarea
                          value={orderNote}
                          onChange={(e) => setOrderNote(e.target.value)}
                          placeholder="Add order note"
                          className="w-full h-[130px] p-4 border border-[#EBEBEB] rounded-[20px] bg-white text-[#555] font-['Inter'] text-[12px] resize-none focus:outline-none focus:border-[#7C3AED]"
                        />
                      </div>

                      {/* Cart Summary */}
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-black font-['Inter'] text-[17px] font-medium leading-[20px]">
                            Subtotal
                          </span>
                          <span className="text-black font-['Inter'] text-[19px] font-medium leading-[20px]">
                            Rs. {subtotal.toLocaleString()}.00
                          </span>
                        </div>

                        <div className="text-[#555] font-['Inter'] text-[13px] leading-[24.5px] space-y-1">
                          <p>Tax included and shipping calculated at</p>
                          <p>checkout</p>
                        </div>

                        {/* Discount Code */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            placeholder="Discount Code"
                            className="flex-1 h-[40px] px-3 border border-[#EBEBEB] rounded-[3px] bg-white text-[#555] font-['Inter'] text-[12px] focus:outline-none focus:border-[#7C3AED]"
                          />
                          <button className="px-6 py-3 bg-black text-white font-['Inter'] text-[10px] font-semibold uppercase rounded-[30px] hover:bg-gray-800 transition-colors">
                            Apply
                          </button>
                        </div>

                        {/* Checkout Button */}
                        <Link to="/checkout">
                          <button className="w-full py-4 bg-black text-white font-['Inter'] text-[10px] font-semibold uppercase rounded-[30px] hover:bg-gray-800 transition-colors">
                            Check out
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
