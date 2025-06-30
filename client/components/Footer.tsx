import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Instagram, Twitter, Facebook, Phone, Mail, MapPin, ShoppingBag, Heart, User, ChevronUp } from "lucide-react";
import { useToast } from "../hooks/use-toast";

export default function Footer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const companyLinks = [
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Store Locations", path: "/stores" },
    { name: "Size Guide", path: "/size-guide" },
    { name: "Track Order", path: "/track-order" },
  ];

  const customerCareLinks = [
    { name: "Help Center", path: "/help" },
    { name: "Return & Exchange", path: "/returns" },
    { name: "Shipping Info", path: "/shipping" },
    { name: "Payment Options", path: "/payments" },
    { name: "FAQs", path: "/faq" },
  ];

  const policyLinks = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Return Policy", path: "/return-policy" },
    { name: "Refund Policy", path: "/refund-policy" },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive updates on our latest collections and offers.",
      });
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  const handleSocialClick = (platform: string) => {
    const socialLinks = {
      instagram: "https://instagram.com/yourstore",
      twitter: "https://twitter.com/yourstore", 
      facebook: "https://facebook.com/yourstore",
    };
    
    window.open(socialLinks[platform as keyof typeof socialLinks], "_blank");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollingText = "Free Delivery on Orders Above ₹999 • Easy Returns • Secure Payments";

  return (
    <footer className="bg-[#111] text-white relative">
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white text-[#111] w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-all duration-300 z-10"
        aria-label="Back to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* Scrolling Banner */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 py-3 overflow-hidden">
        <div className="flex animate-scroll whitespace-nowrap">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex items-center flex-shrink-0">
              <span className="text-white text-sm font-medium px-8">
                {scrollingText}
              </span>
              <div className="w-2 h-2 bg-white rounded-full mx-4"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="border-t border-[#333] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            
            {/* Company Info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">FashionStore</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your ultimate destination for premium fashion. Discover comfort, style, and quality in every piece.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-pink-500" />
                  <a 
                    href="tel:+919876543210" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    +91 98765 43210
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-pink-500" />
                  <a 
                    href="mailto:support@fashionstore.com" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    support@fashionstore.com
                  </a>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-pink-500 mt-1 flex-shrink-0" />
                  <address className="text-gray-300 text-sm not-italic leading-relaxed">
                    123 Fashion Street,<br />
                    Shopping District,<br />
                    Mumbai, Maharashtra 400001
                  </address>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-white font-semibold mb-3">Follow Us</h4>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleSocialClick('instagram')}
                    className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </button>
                  <button 
                    onClick={() => handleSocialClick('facebook')}
                    className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                    aria-label="Follow us on Facebook"
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </button>
                  <button 
                    onClick={() => handleSocialClick('twitter')}
                    className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                    aria-label="Follow us on Twitter"
                  >
                    <Twitter className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">Company</h3>
              <ul className="space-y-3">
                {companyLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-pink-400 transition-colors duration-300 text-sm flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-pink-500 rounded-full"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care */}
            <div className="space-y-4">
              <h3 className="text-white text-lg font-semibold">Customer Care</h3>
              <ul className="space-y-3">
                {customerCareLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-pink-400 transition-colors duration-300 text-sm flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-pink-500 rounded-full"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-4 border-t border-gray-700">
                <h4 className="text-white font-semibold mb-3">Quick Actions</h4>
                <div className="flex gap-3">
                  <Link 
                    to="/cart" 
                    className="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-colors text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Cart
                  </Link>
                  <Link 
                    to="/wishlist" 
                    className="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-colors text-sm"
                  >
                    <Heart className="w-4 h-4" />
                    Wishlist
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-colors text-sm"
                  >
                    <User className="w-4 h-4" />
                    Account
                  </Link>
                </div>
              </div>
            </div>

            {/* Newsletter & Policies */}
            <div className="space-y-6">
              <div>
                <h3 className="text-white text-lg font-semibold mb-4">Stay Updated</h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  Subscribe to get special offers, latest collections, and fashion tips.
                </p>

                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full h-12 px-4 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 text-sm placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-colors"
                      required
                    />
                    <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 px-4 rounded-lg text-sm font-semibold hover:from-pink-700 hover:to-rose-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Subscribing..." : "Subscribe Now"}
                  </button>
                </form>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-3">Legal</h4>
                <ul className="space-y-2">
                  {policyLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.path}
                        className="text-gray-400 hover:text-gray-300 transition-colors duration-300 text-xs"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Payment & Security */}
          <div className="border-t border-gray-700 pt-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-white font-semibold mb-3">We Accept</h4>
                <div className="flex items-center gap-4">
                  <div className="bg-white rounded px-2 py-1">
                    <span className="text-xs font-bold text-blue-600">VISA</span>
                  </div>
                  <div className="bg-white rounded px-2 py-1">
                    <span className="text-xs font-bold text-red-600">MC</span>
                  </div>
                  <div className="bg-white rounded px-2 py-1">
                    <span className="text-xs font-bold text-blue-800">PayPal</span>
                  </div>
                  <div className="bg-white rounded px-2 py-1">
                    <span className="text-xs font-bold text-green-600">UPI</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Secure Shopping</h4>
                <div className="flex items-center gap-4">
                  <div className="bg-gray-800 rounded px-3 py-2 border border-gray-600">
                    <span className="text-xs text-gray-300">SSL Secured</span>
                  </div>
                  <div className="bg-gray-800 rounded px-3 py-2 border border-gray-600">
                    <span className="text-xs text-gray-300">100% Safe</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 FashionStore. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <span>Made with ❤️ in India</span>
              <span>•</span>
              <span>Quality Guaranteed</span>
              <span>•</span>
              <span>Free Shipping ₹999+</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
