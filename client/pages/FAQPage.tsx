import React from 'react';
import { HelpCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqCategories = [
  {
    title: 'General Questions',
    faqs: [
      {
        question: 'What is FashionStore?',
        answer: 'FashionStore is your ultimate destination for premium quality women\'s fashion including leggings, shapewear, nightwear, and more.'
      },
      {
        question: 'How do I create an account?',
        answer: 'Click on the "Register" button at the top of the page and fill in your details. You\'ll receive a confirmation email to activate your account.'
      },
      {
        question: 'Do I need an account to place an order?',
        answer: 'Yes, you need to create an account to place orders, track shipments, and manage returns.'
      }
    ]
  },
  {
    title: 'Orders & Shopping',
    faqs: [
      {
        question: 'How do I place an order?',
        answer: 'Browse our products, add items to your cart, proceed to checkout, fill in your details, and complete payment.'
      },
      {
        question: 'Can I modify my order after placing it?',
        answer: 'You can modify your order within 30 minutes of placing it. Contact our support team for assistance.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay.'
      },
      {
        question: 'How can I track my order?',
        answer: 'You can track your order using the tracking link sent to your email or by visiting the "Track Order" page with your order number.'
      }
    ]
  },
  {
    title: 'Shipping & Delivery',
    faqs: [
      {
        question: 'What are the shipping charges?',
        answer: 'We offer free shipping on orders above ₹999 for metro cities and above ₹1499 for other locations. Express shipping charges apply for faster delivery.'
      },
      {
        question: 'How long does delivery take?',
        answer: 'Standard delivery takes 2-6 business days depending on your location. Express delivery takes 1-3 business days.'
      },
      {
        question: 'Do you deliver internationally?',
        answer: 'Currently, we only deliver within India. We are working on international shipping options.'
      },
      {
        question: 'What if I\'m not available for delivery?',
        answer: 'Our delivery partner will attempt delivery 2-3 times. You can also schedule a convenient delivery time.'
      }
    ]
  },
  {
    title: 'Returns & Exchanges',
    faqs: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for unworn items with original tags and packaging.'
      },
      {
        question: 'How do I return an item?',
        answer: 'Log into your account, go to "My Orders", select the item to return, and schedule a pickup.'
      },
      {
        question: 'How long does it take to get a refund?',
        answer: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item.'
      },
      {
        question: 'Can I exchange an item for a different size?',
        answer: 'Yes, we offer free size exchanges within 30 days of purchase.'
      }
    ]
  },
  {
    title: 'Size & Fit',
    faqs: [
      {
        question: 'How do I find my size?',
        answer: 'Please refer to our detailed size guide with measurements. If you\'re between sizes, we recommend sizing up.'
      },
      {
        question: 'What if the item doesn\'t fit?',
        answer: 'We offer free exchanges for size issues within 30 days. You can also return the item for a full refund.'
      },
      {
        question: 'Are your sizes true to fit?',
        answer: 'Our sizes are designed to fit as per the measurements in our size guide. We recommend checking the size chart before ordering.'
      }
    ]
  },
  {
    title: 'Account & Technical',
    faqs: [
      {
        question: 'I forgot my password. How can I reset it?',
        answer: 'Click on "Forgot Password" on the login page and enter your email. You\'ll receive a password reset link.'
      },
      {
        question: 'How do I update my profile information?',
        answer: 'Log into your account and go to "My Profile" to update your personal information and addresses.'
      },
      {
        question: 'The website is not loading properly. What should I do?',
        answer: 'Try clearing your browser cache and cookies, or try using a different browser. Contact support if the issue persists.'
      }
    ]
  }
];

export default function FAQPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Frequently Asked Questions</h1>
          <p className="text-gray-600 mt-2">Find quick answers to common questions</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6">
                <h2 className="text-xl font-bold">{category.title}</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {category.faqs.map((faq, faqIndex) => (
                    <div key={faqIndex} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0" />
                        {faq.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed ml-8">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-12 text-center">
          <HelpCircle className="w-16 h-16 text-pink-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our customer service team is here to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Contact Support
            </Link>
            <Link 
              to="/help"
              className="border border-pink-600 text-pink-600 px-8 py-3 rounded-lg hover:bg-pink-50 transition-colors"
            >
              Help Center
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Link 
            to="/size-guide"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-pink-600 font-bold">📏</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Size Guide</h3>
            <p className="text-gray-600 text-sm">Find your perfect fit</p>
          </Link>
          
          <Link 
            to="/returns"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold">↩️</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Returns</h3>
            <p className="text-gray-600 text-sm">Easy return process</p>
          </Link>
          
          <Link 
            to="/track-order"
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow text-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">📦</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Track Order</h3>
            <p className="text-gray-600 text-sm">Monitor your shipment</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
