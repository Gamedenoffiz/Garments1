import React from 'react';
import { HelpCircle, MessageCircle, Phone, Mail, Clock, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqData = [
  {
    category: 'Orders & Shipping',
    questions: [
      {
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. Free shipping is available on orders over ₹999.'
      },
      {
        question: 'Can I change my order after placing it?',
        answer: 'You can modify your order within 30 minutes of placing it. After that, please contact our support team for assistance.'
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Currently, we only ship within India. We are working on expanding our international shipping options.'
      }
    ]
  },
  {
    category: 'Returns & Exchanges',
    questions: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for unworn items with original tags. Items must be in original packaging.'
      },
      {
        question: 'How do I initiate a return?',
        answer: 'You can initiate a return through your account dashboard or by contacting our customer service team.'
      },
      {
        question: 'When will I receive my refund?',
        answer: 'Refunds are processed within 5-7 business days after we receive your returned item.'
      }
    ]
  },
  {
    category: 'Sizing & Fit',
    questions: [
      {
        question: 'How do I find my size?',
        answer: 'Please refer to our size guide for detailed measurements. If you\'re between sizes, we recommend sizing up.'
      },
      {
        question: 'What if the item doesn\'t fit?',
        answer: 'We offer free exchanges for size issues within 30 days. Simply initiate an exchange through your account.'
      }
    ]
  }
];

const contactMethods = [
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Mon-Sun: 9 AM - 9 PM',
    contact: '+91 98765 43210',
    action: 'tel:+919876543210'
  },
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Response within 24 hours',
    contact: 'help@fashionstore.com',
    action: 'mailto:help@fashionstore.com'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Available 24/7',
    contact: 'Start Chat',
    action: '#'
  }
];

export default function HelpCenterPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Help Center</h1>
          <p className="text-gray-600 mt-2">Find answers to frequently asked questions</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <method.icon className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{method.description}</p>
              <a 
                href={method.action}
                className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors inline-block"
              >
                {method.contact}
              </a>
            </div>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">{category.category}</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {category.questions.map((faq, faqIndex) => (
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our customer service team is here to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Contact Support
            </Link>
            <a 
              href="mailto:help@fashionstore.com"
              className="border border-pink-600 text-pink-600 px-8 py-3 rounded-lg hover:bg-pink-50 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg p-8 mt-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Clock className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Customer Service Hours</h2>
          </div>
          <div className="text-center space-y-2">
            <p className="text-pink-100">Monday - Sunday: 9:00 AM - 9:00 PM (IST)</p>
            <p className="text-pink-100">Live Chat: Available 24/7</p>
            <p className="text-pink-100">Email Support: Response within 24 hours</p>
          </div>
        </div>
      </div>
    </div>
  );
}
