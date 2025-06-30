import React from 'react';
import { RotateCcw, Package, Truck, CreditCard, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const returnSteps = [
  {
    step: 1,
    title: 'Initiate Return',
    description: 'Log into your account and select the items you want to return',
    icon: Package
  },
  {
    step: 2,
    title: 'Schedule Pickup',
    description: 'Choose a convenient time for our courier to collect the items',
    icon: Truck
  },
  {
    step: 3,
    title: 'Quality Check',
    description: 'We inspect the returned items to ensure they meet our return policy',
    icon: RotateCcw
  },
  {
    step: 4,
    title: 'Refund Processed',
    description: 'Refund is initiated to your original payment method',
    icon: CreditCard
  }
];

const returnConditions = [
  'Items must be unworn and in original condition',
  'Original tags must be attached',
  'Items must be returned within 30 days of purchase',
  'Original packaging and invoice must be included',
  'Innerwear and intimate apparel cannot be returned for hygiene reasons',
  'Sale items and customized products are non-returnable'
];

const exchangeInfo = [
  {
    title: 'Size Exchange',
    description: 'Free size exchanges within 30 days',
    details: 'If the size doesn\'t fit, exchange for a different size at no extra cost'
  },
  {
    title: 'Color Exchange', 
    description: 'Exchange for different color (subject to availability)',
    details: 'Switch to a different color variant of the same product'
  },
  {
    title: 'Product Exchange',
    description: 'Exchange for different product of equal or higher value',
    details: 'Choose a completely different product, pay the difference if applicable'
  }
];

export default function ReturnsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Returns & Exchanges</h1>
          <p className="text-gray-600 mt-2">Easy returns and exchanges for a worry-free shopping experience</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Return Process */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Returns Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {returnSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-pink-600" />
                </div>
                <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Return Policy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Return Conditions</h2>
            <ul className="space-y-3">
              {returnConditions.map((condition, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-gray-600 text-sm">{condition}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 bg-pink-50 rounded-lg">
              <p className="text-pink-800 text-sm">
                <strong>Note:</strong> All returns are subject to quality inspection. Items that don't meet our return conditions may be sent back to you.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Timeline</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">Return Window</span>
                <span className="font-semibold text-gray-900">30 Days</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">Pickup Time</span>
                <span className="font-semibold text-gray-900">1-2 Business Days</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-600">Quality Check</span>
                <span className="font-semibold text-gray-900">2-3 Business Days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Refund Processing</span>
                <span className="font-semibold text-gray-900">5-7 Business Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Exchange Options */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Exchange Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {exchangeInfo.map((exchange, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{exchange.title}</h3>
                <p className="text-purple-600 font-medium text-sm mb-2">{exchange.description}</p>
                <p className="text-gray-600 text-sm">{exchange.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Need to Return or Exchange?</h2>
            <p className="text-pink-100 mb-6">
              Start your return or exchange process now. It's quick and easy!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/login"
                className="bg-white text-pink-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
              >
                Start Return Process
              </Link>
              <Link 
                to="/contact"
                className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-pink-600 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do I need to pay for return shipping?</h3>
              <p className="text-gray-600 text-sm">No, we provide free return pickup for all eligible returns within India.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I return sale items?</h3>
              <p className="text-gray-600 text-sm">Sale items are generally non-returnable unless there's a manufacturing defect.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I track my return?</h3>
              <p className="text-gray-600 text-sm">You'll receive tracking information via email once your return is picked up.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What if my return is rejected?</h3>
              <p className="text-gray-600 text-sm">If your return doesn't meet our conditions, we'll send it back to you with an explanation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
