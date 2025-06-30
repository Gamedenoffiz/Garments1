import React from 'react';
import { Truck, Package, MapPin, Clock, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const shippingZones = [
  {
    zone: 'Metro Cities',
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'],
    standard: '2-3 days',
    express: '1 day',
    cost: 'Free above ₹999'
  },
  {
    zone: 'Tier 1 Cities',
    cities: ['Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur'],
    standard: '3-4 days',
    express: '2 days',
    cost: 'Free above ₹999'
  },
  {
    zone: 'Tier 2/3 Cities',
    cities: ['Other cities and towns'],
    standard: '4-6 days',
    express: '3-4 days',
    cost: 'Free above ₹1499'
  }
];

const shippingOptions = [
  {
    type: 'Standard Shipping',
    icon: Package,
    description: 'Regular delivery timeline',
    features: ['Free above minimum order', 'Tracking included', 'Secure packaging']
  },
  {
    type: 'Express Shipping',
    icon: Truck,
    description: 'Faster delivery option',
    features: ['Next day delivery*', 'Priority handling', 'Real-time tracking']
  }
];

export default function ShippingPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Shipping Information</h1>
          <p className="text-gray-600 mt-2">Fast and reliable delivery across India</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Shipping Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {shippingOptions.map((option, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                  <option.icon className="w-8 h-8 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{option.type}</h2>
                  <p className="text-gray-600">{option.description}</p>
                </div>
              </div>
              <ul className="space-y-3">
                {option.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-pink-500 rounded-full"></span>
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Shipping Zones */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6">
            <h2 className="text-2xl font-bold">Delivery Timeline by Zone</h2>
            <p className="text-pink-100">Estimated delivery times across India</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Zone</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Cities</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Standard</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Express</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Free Shipping</th>
                </tr>
              </thead>
              <tbody>
                {shippingZones.map((zone, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-6 font-medium text-gray-900">{zone.zone}</td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      {zone.cities.slice(0, 3).join(', ')}
                      {zone.cities.length > 3 && '...'}
                    </td>
                    <td className="py-4 px-6 text-gray-600">{zone.standard}</td>
                    <td className="py-4 px-6 text-gray-600">{zone.express}</td>
                    <td className="py-4 px-6 text-green-600 font-medium">{zone.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipping Process */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How We Ship</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Processing</h3>
              <p className="text-gray-600 text-sm">Orders are processed within 24 hours of confirmation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Check</h3>
              <p className="text-gray-600 text-sm">Each item is carefully inspected before packaging</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Dispatch</h3>
              <p className="text-gray-600 text-sm">Your order is dispatched with trusted courier partners</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Delivery</h3>
              <p className="text-gray-600 text-sm">Safe delivery to your doorstep with tracking updates</p>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Important Notes</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Cutoff Times:</strong>
                  <p className="text-gray-600 text-sm">Orders placed before 2 PM are processed the same day</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Package className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Packaging:</strong>
                  <p className="text-gray-600 text-sm">Eco-friendly packaging with secure protection</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                <div>
                  <strong className="text-gray-900">Tracking:</strong>
                  <p className="text-gray-600 text-sm">Real-time tracking information via SMS and email</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Partners</h2>
            <p className="text-gray-600 mb-4">We work with trusted logistics partners to ensure reliable delivery:</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="font-semibold text-gray-900">BlueDart</p>
                <p className="text-gray-600 text-sm">Express Delivery</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="font-semibold text-gray-900">Delhivery</p>
                <p className="text-gray-600 text-sm">Standard Delivery</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="font-semibold text-gray-900">DTDC</p>
                <p className="text-gray-600 text-sm">Regional Coverage</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="font-semibold text-gray-900">Ekart</p>
                <p className="text-gray-600 text-sm">Last Mile Delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Questions About Shipping?</h2>
          <p className="text-pink-100 mb-6">Our support team is here to help with any shipping queries</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="bg-white text-pink-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Contact Support
            </Link>
            <Link 
              to="/track-order"
              className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-pink-600 transition-colors"
            >
              Track Your Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
