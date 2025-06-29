import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface LoginPageProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function LoginPage({ isModal = false, onClose }: LoginPageProps) {
  const { signIn, signUp, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: false,
  });

  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear error when user types
  };

  const handleRegisterInputChange = (field: string, value: string | boolean) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
    setError(null); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Login successful!");
        setTimeout(() => {
          if (onClose) onClose();
        }, 1000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    
    if (!registerData.agreeToTerms) {
      setError("Please agree to the Terms & Conditions");
      return;
    }
    
    try {
      const { error } = await signUp(
        registerData.email, 
        registerData.password,
        {
          first_name: registerData.firstName,
          last_name: registerData.lastName
        }
      );
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Account created successfully! Please check your email to verify your account.");
        // Switch back to login after successful registration
        setTimeout(() => {
          setShowRegister(false);
          setSuccess(null);
        }, 3000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const switchToRegister = () => {
    setShowRegister(true);
    setError(null);
    setSuccess(null);
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setError(null);
    setSuccess(null);
  };

  // Login Form Content
  const loginContent = (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-900">Login</h2>
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
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Your email*
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password*
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-600 hover:text-[#7C3AED] transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 px-6 rounded-full font-semibold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>

          {/* Create Account Link */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={switchToRegister}
                className="text-[#7C3AED] hover:text-[#6D28D9] font-medium transition-colors underline"
              >
                CREATE ACCOUNT
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );

  // Register Form Content
  const registerContent = (
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
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                value={registerData.firstName}
                onChange={(e) => handleRegisterInputChange("firstName", e.target.value)}
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
                value={registerData.lastName}
                onChange={(e) => handleRegisterInputChange("lastName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              id="registerEmail"
              value={registerData.email}
              onChange={(e) => handleRegisterInputChange("email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors"
              required
            />
          </div>

          {/* Password Fields */}
          <div>
            <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Password*
            </label>
            <input
              type="password"
              id="registerPassword"
              value={registerData.password}
              onChange={(e) => handleRegisterInputChange("password", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition-colors"
              minLength={6}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password*
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={registerData.confirmPassword}
              onChange={(e) => handleRegisterInputChange("confirmPassword", e.target.value)}
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
                checked={registerData.agreeToTerms}
                onChange={(e) => handleRegisterInputChange("agreeToTerms", e.target.checked)}
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
                checked={registerData.subscribeNewsletter}
                onChange={(e) => handleRegisterInputChange("subscribeNewsletter", e.target.checked)}
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
            disabled={loading}
            className="w-full bg-black text-white py-3 px-6 rounded-full font-semibold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={switchToLogin}
                className="text-[#7C3AED] hover:text-[#6D28D9] font-medium transition-colors underline"
              >
                LOGIN
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );

  const content = showRegister ? registerContent : loginContent;

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