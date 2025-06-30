import React from 'react';
import { Shield, Eye, Lock, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">Last updated: January 1, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Shield className="w-8 h-8 text-pink-600" />
            <h2 className="text-2xl font-bold text-gray-900">Our Commitment to Privacy</h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            At FashionStore, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
            or make purchases from us.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Eye className="w-6 h-6 text-pink-600" />
            Information We Collect
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  Name, email address, phone number, and postal address
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  Payment information (processed securely through payment gateways)
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  Purchase history and preferences
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  IP address, browser type, and device information
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  Website usage data and analytics
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  Cookies and similar tracking technologies
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How We Use Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Order Processing</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Process and fulfill your orders</li>
                <li>• Send order confirmations and updates</li>
                <li>• Handle returns and exchanges</li>
                <li>• Provide customer support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Communication</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Send promotional emails (with consent)</li>
                <li>• Notify about new products and offers</li>
                <li>• Respond to inquiries and support requests</li>
                <li>• Send important account updates</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data Protection */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Lock className="w-6 h-6 text-pink-600" />
            Data Protection & Security
          </h2>
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              We implement appropriate security measures to protect your personal information against unauthorized access, 
              alteration, disclosure, or destruction. This includes:
            </p>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                SSL encryption for data transmission
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                Secure payment processing through certified gateways
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                Regular security audits and updates
              </li>
              <li className="flex items-start gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                Limited access to personal data on a need-to-know basis
              </li>
            </ul>
          </div>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Rights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Access & Control</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Access your personal data</li>
                <li>• Update or correct information</li>
                <li>• Delete your account</li>
                <li>• Opt-out of marketing emails</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Data Portability</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>• Request a copy of your data</li>
                <li>• Transfer data to another service</li>
                <li>• Restrict processing of your data</li>
                <li>• Object to data processing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cookies Policy */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Cookies Policy</h2>
          <p className="text-gray-600 text-sm mb-4">
            We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, 
            and personalize content. You can control cookie settings through your browser preferences.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Essential Cookies</h4>
              <p className="text-gray-600 text-xs">Required for website functionality</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Analytics Cookies</h4>
              <p className="text-gray-600 text-xs">Help us understand site usage</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Marketing Cookies</h4>
              <p className="text-gray-600 text-xs">Enable personalized advertising</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg p-8">
          <h2 className="text-xl font-bold mb-4">Questions About Privacy?</h2>
          <p className="text-pink-100 mb-6">
            If you have any questions about this Privacy Policy or how we handle your data, please contact us.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <a href="mailto:privacy@fashionstore.com" className="text-pink-100 hover:text-white">
                privacy@fashionstore.com
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
