import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Info } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

interface CheckoutFormData {
  email: string;
  subscribeToNews: boolean;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  saveInfo: boolean;
  discountCode: string;
  paymentMethod: "razorpay" | "cod";
  billingAddress: "same" | "different";
}

interface OrderItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutPageProps {
  orderItems?: OrderItem[];
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems: dbCartItems, getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  // Convert database cart items to the format expected by the component
  const orderItems = dbCartItems.map(item => ({
    id: item.id,
    name: item.product.name,
    size: item.variant?.size || 'N/A',
    price: item.product.price,
    quantity: item.quantity,
    image: item.product.images.find(img => img.is_primary)?.image_url || '/placeholder.svg'
  }));
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    subscribeToNews: false,
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "Tamil Nadu",
    pinCode: "",
    phone: "",
    saveInfo: false,
    discountCode: "",
    paymentMethod: "razorpay",
    billingAddress: "same",
  });

  const handleInputChange = (
    field: keyof CheckoutFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePayment = async () => {
    // Validate required fields
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.pinCode || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear the cart after successful payment
      await clearCart();
      
      // Simulate successful payment
      toast({
        title: "Payment Successful!",
        description: "Your order has been placed successfully",
      });

      // Redirect to orders page
      navigate("/orders");
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // If cart is empty, redirect to cart page
  const finalOrderItems = orderItems;

  if (orderItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Add some items to your cart before checkout</p>
          <Link to="/" className="bg-[#111] text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const taxes = Math.round(subtotal * 0.048); // Approximate 4.8% tax
  const total = subtotal;

  return (
    <div className="min-h-screen bg-white">
      <Header cartCount={orderItems.reduce((sum, item) => sum + item.quantity, 0)} />

      <div className="max-w-7xl mx-auto lg:flex lg:gap-8 xl:gap-12">
        {/* Main Form Section */}
        <div className="flex-1 px-6 py-8 lg:px-8 lg:py-12">
          <div className="max-w-md mx-auto lg:max-w-none">
            {/* Contact Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Contact</h2>
                <Link
                  to="/login"
                  className="text-sm text-[#EA7777] underline hover:no-underline"
                >
                  Log in
                </Link>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent placeholder-gray-500"
                    placeholder="Email"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="subscribe"
                      checked={formData.subscribeToNews}
                      onChange={(e) =>
                        handleInputChange("subscribeToNews", e.target.checked)
                      }
                      className="w-5 h-5 text-[#EA7777] border-2 border-gray-300 rounded focus:ring-[#EA7777] focus:ring-2"
                    />
                    {formData.subscribeToNews && (
                      <svg
                        className="w-3 h-3 text-white absolute left-1 top-1 pointer-events-none"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <label htmlFor="subscribe" className="text-sm text-black">
                    Email me with news and offers
                  </label>
                </div>
              </div>
            </div>

            {/* Delivery Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-black mb-4">Delivery</h2>

              <div className="space-y-4">
                {/* Country Selection */}
                <div className="relative">
                  <label className="block text-xs text-gray-500 mb-1">
                    Country/Region
                  </label>
                  <div className="relative">
                    <select className="w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] appearance-none bg-white">
                      <option value="india">India</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] placeholder-gray-500"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] placeholder-gray-500"
                  />
                </div>

                {/* Company */}
                <input
                  type="text"
                  placeholder="Company (optional)"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] placeholder-gray-500"
                />

                {/* Address */}
                <input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] placeholder-gray-500"
                />

                {/* Apartment */}
                <input
                  type="text"
                  placeholder="Apartment, suite, etc."
                  value={formData.apartment}
                  onChange={(e) =>
                    handleInputChange("apartment", e.target.value)
                  }
                  className="w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] placeholder-gray-500"
                />

                {/* City, State, PIN */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] placeholder-gray-500"
                  />
                  <div className="relative">
                    <label className="block text-xs text-gray-500 mb-1">
                      State
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      className="w-full px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] appearance-none bg-white"
                    >
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Kerala">Kerala</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                  </div>
                  <input
                    type="text"
                    placeholder="PIN code"
                    value={formData.pinCode}
                    onChange={(e) =>
                      handleInputChange("pinCode", e.target.value)
                    }
                    className="px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] placeholder-gray-500"
                  />
                </div>

                {/* Phone */}
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] placeholder-gray-500"
                  />
                  <Info className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                </div>

                {/* Save Info Checkbox */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="saveInfo"
                    checked={formData.saveInfo}
                    onChange={(e) =>
                      handleInputChange("saveInfo", e.target.checked)
                    }
                    className="w-5 h-5 text-[#7C3AED] border-2 border-gray-300 rounded focus:ring-[#7C3AED] focus:ring-2"
                  />
                  <label htmlFor="saveInfo" className="text-sm text-black">
                    Save this information for next time
                  </label>
                </div>

                {/* Shipping Method */}
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-black mb-4">
                    Shipping method
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500">
                      Enter your shipping address to view available shipping
                      methods.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-black mb-2">Payment</h2>
              <p className="text-sm text-gray-500 mb-6">
                All transactions are secure and encrypted.
              </p>

              <div className="space-y-0 border border-gray-300 rounded-lg overflow-hidden">
                {/* Razorpay Option */}
                <div
                  className={`p-4 ${formData.paymentMethod === "razorpay" ? "border-2 border-[#EA7777] bg-white" : "border-b border-gray-300"}`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="razorpay"
                      name="payment"
                      checked={formData.paymentMethod === "razorpay"}
                      onChange={() =>
                        handleInputChange("paymentMethod", "razorpay")
                      }
                      className="w-4 h-4 text-[#EA7777] border-2 border-[#EA7777] focus:ring-[#EA7777] focus:ring-2"
                    />
                    <label htmlFor="razorpay" className="flex-1 text-sm">
                      Razorpay Secure (UPI, Cards, Wallets, NetBanking)
                    </label>
                    <div className="flex space-x-1">
                      {/* Payment method icons */}
                      <div className="w-8 h-5 bg-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">
                        UPI
                      </div>
                      <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        V
                      </div>
                      <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                        M
                      </div>
                      <div className="w-8 h-5 bg-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">
                        R
                      </div>
                      <div className="w-8 h-5 bg-[#EA7777] rounded text-white text-xs flex items-center justify-center font-bold">
                        +16
                      </div>
                    </div>
                  </div>

                  {formData.paymentMethod === "razorpay" && (
                    <div className="mt-4 bg-gray-50 p-4 rounded text-center">
                      <div className="w-32 h-16 bg-white border border-gray-300 rounded mx-auto mb-4 flex items-center justify-center">
                        <div className="w-20 h-8 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">→</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">
                        After clicking "Pay now", you will be redirected to
                        <br />
                        Razorpay Secure (UPI, Cards, Wallets, NetBanking) to
                        <br />
                        complete your purchase securely.
                      </p>
                    </div>
                  )}
                </div>

                {/* COD Option */}
                <div
                  className={`p-4 ${formData.paymentMethod === "cod" ? "border-2 border-[#EA7777] bg-white" : ""}`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="cod"
                      name="payment"
                      checked={formData.paymentMethod === "cod"}
                      onChange={() => handleInputChange("paymentMethod", "cod")}
                      className="w-4 h-4 text-[#EA7777] border-2 border-gray-300 focus:ring-[#EA7777] focus:ring-2"
                    />
                    <label htmlFor="cod" className="text-sm">
                      Cash on Delivery (COD)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Address Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-black mb-4">
                Billing address
              </h3>

              <div className="space-y-0 border border-gray-300 rounded-lg overflow-hidden">
                <div
                  className={`p-4 ${formData.billingAddress === "same" ? "border-2 border-[#EA7777] bg-white" : "border-b border-gray-300"}`}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="sameAddress"
                      name="billing"
                      checked={formData.billingAddress === "same"}
                      onChange={() =>
                        handleInputChange("billingAddress", "same")
                      }
                      className="w-4 h-4 text-[#EA7777] border-2 border-[#EA7777] focus:ring-[#EA7777] focus:ring-2"
                    />
                    <label htmlFor="sameAddress" className="text-sm">
                      Same as shipping address
                    </label>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="differentAddress"
                      name="billing"
                      checked={formData.billingAddress === "different"}
                      onChange={() =>
                        handleInputChange("billingAddress", "different")
                      }
                      className="w-4 h-4 text-[#EA7777] border-2 border-gray-300 focus:ring-[#EA7777] focus:ring-2"
                    />
                    <label htmlFor="differentAddress" className="text-sm">
                      Use a different billing address
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Pay Now Button */}
            <button
              className="w-full bg-gradient-to-r from-[#7C3AED] to-[#2563EB] text-white py-4 px-6 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handlePayment}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay now"}
            </button>

            {/* Footer Links */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/refund-policy"
                className="text-[#EA7777] underline hover:no-underline"
              >
                Refund policy
              </Link>
              <Link
                to="/privacy-policy"
                className="text-[#EA7777] underline hover:no-underline"
              >
                Privacy policy
              </Link>
              <Link
                to="/terms-of-service"
                className="text-[#EA7777] underline hover:no-underline"
              >
                Terms of service
              </Link>
              <Link
                to="/contact"
                className="text-[#EA7777] underline hover:no-underline"
              >
                Contact information
              </Link>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-96 xl:w-[480px] bg-gray-50 lg:bg-white border-t lg:border-t-0 lg:border-l border-gray-200">
          <div className="p-6 lg:p-8 lg:py-12">
            <div className="space-y-6">
              {/* Order Items */}
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute -top-2 -right-2 bg-black bg-opacity-60 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-black">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">{item.size}</p>
                    </div>
                    <div className="text-sm font-medium text-black">
                      ₹{item.price.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="flex space-x-3">
                <input
                  type="text"
                  placeholder="Discount code"
                  value={formData.discountCode}
                  onChange={(e) =>
                    handleInputChange("discountCode", e.target.value)
                  }
                  className="flex-1 px-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] placeholder-gray-500"
                />
                <button
                  className="px-4 py-4 bg-gray-100 border border-gray-300 rounded-lg font-bold text-sm text-black hover:bg-gray-200 transition-colors disabled:opacity-50"
                  disabled={!formData.discountCode.trim()}
                >
                  Apply
                </button>
              </div>

              {/* Order Summary */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-black">Subtotal</span>
                  <span className="text-black">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-black">Shipping</span>
                  <span className="text-gray-500">Enter shipping address</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                  <span className="text-black">Total</span>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">INR</div>
                    <div className="text-black">₹{total.toLocaleString()}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Including ₹{taxes} in taxes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
