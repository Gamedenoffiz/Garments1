import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const orderStatuses = {
  'confirmed': { 
    icon: CheckCircle, 
    color: 'text-green-600', 
    bgColor: 'bg-green-100',
    description: 'Order confirmed and being prepared'
  },
  'processing': { 
    icon: Package, 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100',
    description: 'Order is being packed'
  },
  'shipped': { 
    icon: Truck, 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-100',
    description: 'Order has been shipped'
  },
  'delivered': { 
    icon: CheckCircle, 
    color: 'text-green-600', 
    bgColor: 'bg-green-100',
    description: 'Order delivered successfully'
  }
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (orderNumber && email) {
        // Mock tracking data
        setTrackingResult({
          orderNumber: orderNumber,
          status: 'shipped',
          estimatedDelivery: '2025-01-05',
          trackingNumber: 'TRK123456789',
          timeline: [
            { status: 'Order Placed', date: '2025-01-01', time: '10:30 AM', completed: true },
            { status: 'Order Confirmed', date: '2025-01-01', time: '11:15 AM', completed: true },
            { status: 'Packed', date: '2025-01-02', time: '02:45 PM', completed: true },
            { status: 'Shipped', date: '2025-01-03', time: '09:20 AM', completed: true },
            { status: 'Out for Delivery', date: '2025-01-05', time: 'Expected', completed: false },
            { status: 'Delivered', date: '2025-01-05', time: 'Expected', completed: false }
          ]
        });
      }
      setIsLoading(false);
    }, 1500);
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Track Your Order</h1>
          <p className="text-gray-600 mt-2">Enter your order details to track your shipment</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Tracking Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. ORD123456789"
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  Tracking...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Track Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tracking Results */}
        {trackingResult && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Order Header */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Order #{trackingResult.orderNumber}</h2>
                  <p className="text-pink-100">Tracking Number: {trackingResult.trackingNumber}</p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${orderStatuses[trackingResult.status].bgColor} ${orderStatuses[trackingResult.status].color}`}>
                    {React.createElement(orderStatuses[trackingResult.status].icon, { className: "w-4 h-4" })}
                    {trackingResult.status.charAt(0).toUpperCase() + trackingResult.status.slice(1)}
                  </div>
                  <p className="text-pink-100 text-sm mt-1">
                    Est. Delivery: {new Date(trackingResult.estimatedDelivery).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Timeline</h3>
              <div className="space-y-4">
                {trackingResult.timeline.map((step: any, index: number) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <h4 className={`font-medium ${
                          step.completed ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.status}
                        </h4>
                        <div className={`text-sm ${
                          step.completed ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                          {step.date} • {step.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors">
                  View Order Details
                </button>
                <Link 
                  to="/contact"
                  className="flex-1 border border-pink-600 text-pink-600 py-2 px-4 rounded-lg hover:bg-pink-50 transition-colors text-center"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can't find your order?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Make sure you're using the email address from your order confirmation and the correct order number.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Questions about delivery?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Our support team is available 24/7 to help with any delivery concerns.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Link 
              to="/contact"
              className="bg-pink-600 text-white py-2 px-6 rounded-lg hover:bg-pink-700 transition-colors text-center"
            >
              Contact Support
            </Link>
            <a 
              href="tel:+919876543210"
              className="border border-pink-600 text-pink-600 py-2 px-6 rounded-lg hover:bg-pink-50 transition-colors text-center"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
