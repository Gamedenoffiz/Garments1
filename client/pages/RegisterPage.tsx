import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

interface RegisterPageProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function RegisterPage({ isModal = false, onClose }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      console.log("Registration attempt:", formData);
      // Handle successful registration here
      if (onClose) onClose();
    }, 1000);
  };

  const content = (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900">Create Account</h2>
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Form */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name*
              </label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Password Fields */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password*
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password*
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                className="w-4 h-4 text-[#7C3AED] border-gray-300 rounded focus:ring-[#7C3AED] focus:ring-2 mt-1"
                required
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                I agree to the{" "}
                <Link to="/terms" className="text-[#7C3AED] hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-[#7C3AED] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="subscribeNewsletter"
                checked={formData.subscribeNewsletter}
                onChange={(e) => handleInputChange("subscribeNewsletter", e.target.checked)}
                className="w-4 h-4 text-[#7C3AED] border-gray-300 rounded focus:ring-[#7C3AED] focus:ring-2"
              />
              <label htmlFor="subscribeNewsletter" className="text-sm text-gray-700">
                Subscribe to our newsletter for updates and offers
              </label>
            </div>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 px-6 rounded-full font-semibold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#7C3AED] hover:text-[#6D28D9] font-medium transition-colors"
              >
                LOGIN
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {content}
    </div>
  );
}