import React from 'react';
import { FileText, Scale, AlertCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link 
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Terms & Conditions</h1>
          <p className="text-gray-600 mt-2">Last updated: January 1, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <FileText className="w-8 h-8 text-pink-600" />
            <h2 className="text-2xl font-bold text-gray-900">Agreement to Terms</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Welcome to FashionStore. These Terms and Conditions ("Terms") govern your use of our website and services. 
            By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of 
            these terms, then you may not access our services.
          </p>
        </div>

        {/* Use of Website */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Scale className="w-6 h-6 text-pink-600" />
            Use of Website
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Permitted Use</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Browse and purchase products for personal use
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Create an account and manage your profile
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Leave honest reviews and feedback
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  Contact customer support for assistance
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Prohibited Use</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  Violate any applicable laws or regulations
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  Use automated systems to scrape content
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  Attempt to gain unauthorized access
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                  Post false or misleading information
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Orders and Payments */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Orders and Payments</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Acceptance</h3>
              <p className="text-gray-600 text-sm">
                All orders are subject to acceptance by FashionStore. We reserve the right to refuse or cancel any order 
                for any reason, including availability, errors in pricing, or suspected fraudulent activity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
              <p className="text-gray-600 text-sm">
                All prices are listed in Indian Rupees (INR) and include applicable taxes. Prices are subject to change 
                without notice. We reserve the right to correct any pricing errors.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Payment</h3>
              <p className="text-gray-600 text-sm">
                Payment must be made in full at the time of order. We accept various payment methods as listed on our 
                payment page. All transactions are processed securely.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping and Returns */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping and Returns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Shipping</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Delivery times are estimates, not guarantees</li>
                <li>• Free shipping on orders above specified amounts</li>
                <li>• Risk of loss passes to buyer upon delivery</li>
                <li>• Additional charges may apply for remote areas</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Returns</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• 30-day return policy for eligible items</li>
                <li>• Items must be in original condition</li>
                <li>• Return shipping may be customer's responsibility</li>
                <li>• Refunds processed within 5-7 business days</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Intellectual Property</h2>
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              All content on this website, including but not limited to text, graphics, logos, images, and software, 
              is the property of FashionStore or its licensors and is protected by copyright, trademark, and other 
              intellectual property laws.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Important Notice</h4>
                  <p className="text-yellow-700 text-sm">
                    You may not reproduce, distribute, or create derivative works from our content without explicit permission.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Limitation of Liability</h2>
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              FashionStore shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including but not limited to loss of profits, data, or use, arising out of or in connection with your use 
              of our website or services.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Maximum Liability</h4>
              <p className="text-gray-600 text-sm">
                In no event shall our total liability exceed the amount you paid for the specific product or service 
                that gives rise to the claim.
              </p>
            </div>
          </div>
        </div>

        {/* Governing Law */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Governing Law</h2>
          <p className="text-gray-600 text-sm">
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising 
            out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in 
            Mumbai, Maharashtra.
          </p>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Changes to Terms</h2>
          <p className="text-gray-600 text-sm">
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting 
            on our website. Your continued use of our services after any changes constitutes acceptance of the new Terms.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg p-8">
          <h2 className="text-xl font-bold mb-4">Questions About Our Terms?</h2>
          <p className="text-pink-100 mb-6">
            If you have any questions about these Terms and Conditions, please contact us.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <a href="mailto:legal@fashionstore.com" className="text-pink-100 hover:text-white">
                legal@fashionstore.com
              </a>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact Support</h3>
              <Link to="/contact" className="text-pink-100 hover:text-white">
                Visit Contact Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
