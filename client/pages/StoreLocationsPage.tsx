import React from 'react';
import { MapPin, Phone, Clock, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const stores = [
  {
    id: 1,
    name: 'Mumbai Flagship Store',
    address: '123 Fashion Street, Bandra West, Mumbai, Maharashtra 400050',
    phone: '+91 98765 43210',
    hours: 'Mon-Sun: 10:00 AM - 10:00 PM',
    features: ['Personal Styling', 'Alterations', 'VIP Shopping']
  },
  {
    id: 2,
    name: 'Delhi Select City Walk',
    address: 'A-3, District Centre, Saket, New Delhi 110017',
    phone: '+91 98765 43211',
    hours: 'Mon-Sun: 11:00 AM - 11:00 PM',
    features: ['Express Delivery', 'Personal Shopper', 'Gift Wrapping']
  },
  {
    id: 3,
    name: 'Bangalore Forum Mall',
    address: '21, Hosur Road, Koramangala, Bangalore, Karnataka 560095',
    phone: '+91 98765 43212',
    hours: 'Mon-Sun: 10:30 AM - 10:30 PM',
    features: ['Size Consultation', 'Custom Fitting', 'Loyalty Program']
  }
];

export default function StoreLocationsPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Store Locations</h1>
          <p className="text-gray-600 mt-2">Visit our physical stores for a personalized shopping experience</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{store.name}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-pink-500 mt-1 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{store.address}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-pink-500" />
                    <a href={`tel:${store.phone}`} className="text-gray-600 text-sm hover:text-pink-600">
                      {store.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-pink-500" />
                    <p className="text-gray-600 text-sm">{store.hours}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Services Available</h4>
                  <div className="flex flex-wrap gap-2">
                    {store.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full mt-6 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors">
                  Get Directions
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Can't Find a Store Near You?</h2>
          <p className="text-gray-600 mb-6">
            We're expanding our presence across India. Contact us to learn about upcoming store openings in your city.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact"
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Contact Us
            </Link>
            <a 
              href="mailto:stores@fashionstore.com"
              className="border border-pink-600 text-pink-600 px-6 py-3 rounded-lg hover:bg-pink-50 transition-colors"
            >
              Email Store Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
