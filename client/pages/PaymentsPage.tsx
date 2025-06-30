import React from 'react';
import { CreditCard, Smartphone, Shield, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const paymentMethods = [
  {
    category: 'Credit/Debit Cards',
    methods: ['Visa', 'Mastercard', 'RuPay', 'American Express'],
    icon: CreditCard,
    description: 'All major credit and debit cards accepted'
  },
  {
    category: 'Digital Wallets',
    methods: ['Paytm', 'PhonePe', 'Google Pay', 'Amazon Pay'],
    icon: Smartphone,
    description: 'Quick and secure digital payments'
  },
  {
    category: 'Bank Transfers',
    methods: ['UPI', 'Net Banking', 'NEFT/RTGS'],
    icon: Shield,
    description: 'Direct bank transfers and UPI payments'
  }
];

const features = [
  'SSL 256-bit encryption for all transactions',
  'PCI DSS compliant payment processing',
  '100% secure and safe transactions',
  'No storage of payment information',
  'Real-time payment confirmation',
  'Multiple payment retry options'
];

export default function PaymentsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Payment Options</h1>
          <p className="text-gray-600 mt-2">Secure and convenient payment methods for your shopping</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Payment Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {paymentMethods.map((payment, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <payment.icon className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 text-center mb-4">{payment.category}</h2>
              <p className="text-gray-600 text-center text-sm mb-6">{payment.description}</p>
              <div className="space-y-2">
                {payment.methods.map((method, methodIndex) => (
                  <div key={methodIndex} className="bg-gray-50 p-3 rounded-lg text-center">
                    <span className="text-gray-900 font-medium">{method}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Security Features */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Payment Security</h2>
            <p className="text-gray-600 mt-2">Your payment information is always protected</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-gray-600 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Process */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Payment Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-pink-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Select Items</h3>
              <p className="text-gray-600 text-sm">Add items to cart and proceed to checkout</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-pink-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose Payment</h3>
              <p className="text-gray-600 text-sm">Select your preferred payment method</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-pink-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600 text-sm">Complete payment through secure gateway</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-pink-600 font-bold">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Confirmed</h3>
              <p className="text-gray-600 text-sm">Receive confirmation and tracking details</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Payment FAQs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Is it safe to pay online?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Yes, we use industry-standard SSL encryption and secure payment gateways to protect your information.
              </p>
              
              <h3 className="font-semibold text-gray-900 mb-3">Do you store my payment details?</h3>
              <p className="text-gray-600 text-sm mb-4">
                No, we do not store any payment information. All transactions are processed securely through our payment partners.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">What if my payment fails?</h3>
              <p className="text-gray-600 text-sm mb-4">
                You can retry the payment or choose a different payment method. Contact support if the issue persists.
              </p>
              
              <h3 className="font-semibold text-gray-900 mb-3">Can I get a refund?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Yes, refunds are processed to your original payment method within 5-7 business days after return approval.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Payment Issues?</h2>
          <p className="text-pink-100 mb-6">
            Our support team is ready to help with any payment-related questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="bg-white text-pink-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              Contact Support
            </Link>
            <a 
              href="mailto:payments@fashionstore.com"
              className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-pink-600 transition-colors"
            >
              Email Payment Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
