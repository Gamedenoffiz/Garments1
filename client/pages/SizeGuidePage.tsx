import React from 'react';
import { Ruler, Package, Heart, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const sizingGuide = {
  tops: [
    { size: 'XS', bust: '30-32', waist: '24-26', hips: '34-36' },
    { size: 'S', bust: '32-34', waist: '26-28', hips: '36-38' },
    { size: 'M', bust: '34-36', waist: '28-30', hips: '38-40' },
    { size: 'L', bust: '36-38', waist: '30-32', hips: '40-42' },
    { size: 'XL', bust: '38-40', waist: '32-34', hips: '42-44' },
    { size: 'XXL', bust: '40-42', waist: '34-36', hips: '44-46' }
  ],
  bottoms: [
    { size: 'XS', waist: '24-26', hips: '34-36', inseam: '28-30' },
    { size: 'S', waist: '26-28', hips: '36-38', inseam: '28-30' },
    { size: 'M', waist: '28-30', hips: '38-40', inseam: '29-31' },
    { size: 'L', waist: '30-32', hips: '40-42', inseam: '29-31' },
    { size: 'XL', waist: '32-34', hips: '42-44', inseam: '30-32' },
    { size: 'XXL', waist: '34-36', hips: '44-46', inseam: '30-32' }
  ]
};

const measurementTips = [
  {
    title: 'Bust Measurement',
    description: 'Measure around the fullest part of your bust, keeping the tape level.',
    icon: Package
  },
  {
    title: 'Waist Measurement', 
    description: 'Measure around the narrowest part of your waist, usually just above the navel.',
    icon: Ruler
  },
  {
    title: 'Hip Measurement',
    description: 'Measure around the fullest part of your hips, about 8 inches below your waist.',
    icon: Heart
  }
];

export default function SizeGuidePage() {
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
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Size Guide</h1>
          <p className="text-gray-600 mt-2">Find your perfect fit with our comprehensive sizing charts</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Measurement Tips */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Measure</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {measurementTips.map((tip, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <tip.icon className="w-8 h-8 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Size Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Tops Size Chart */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-pink-600 text-white p-6">
              <h2 className="text-xl font-bold">Tops & T-Shirts</h2>
              <p className="text-pink-100 text-sm mt-1">All measurements in inches</p>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-gray-900 font-semibold">Size</th>
                      <th className="text-left py-3 text-gray-900 font-semibold">Bust</th>
                      <th className="text-left py-3 text-gray-900 font-semibold">Waist</th>
                      <th className="text-left py-3 text-gray-900 font-semibold">Hips</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizingGuide.tops.map((size, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 text-gray-900 font-medium">{size.size}</td>
                        <td className="py-3 text-gray-600">{size.bust}"</td>
                        <td className="py-3 text-gray-600">{size.waist}"</td>
                        <td className="py-3 text-gray-600">{size.hips}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Bottoms Size Chart */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-purple-600 text-white p-6">
              <h2 className="text-xl font-bold">Bottoms & Leggings</h2>
              <p className="text-purple-100 text-sm mt-1">All measurements in inches</p>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-gray-900 font-semibold">Size</th>
                      <th className="text-left py-3 text-gray-900 font-semibold">Waist</th>
                      <th className="text-left py-3 text-gray-900 font-semibold">Hips</th>
                      <th className="text-left py-3 text-gray-900 font-semibold">Inseam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizingGuide.bottoms.map((size, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 text-gray-900 font-medium">{size.size}</td>
                        <td className="py-3 text-gray-600">{size.waist}"</td>
                        <td className="py-3 text-gray-600">{size.hips}"</td>
                        <td className="py-3 text-gray-600">{size.inseam}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Size Tips */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sizing Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">For the Best Fit</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  Measure yourself while wearing well-fitting undergarments
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  Keep the measuring tape snug but not tight
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  If you're between sizes, we recommend sizing up
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></span>
                  Check the product description for specific fit details
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Still unsure about sizing? Our customer service team is here to help you find the perfect fit.
              </p>
              <div className="space-y-3">
                <Link 
                  to="/contact"
                  className="block text-center bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Contact Support
                </Link>
                <a 
                  href="mailto:sizing@fashionstore.com"
                  className="block text-center border border-pink-600 text-pink-600 py-2 px-4 rounded-lg hover:bg-pink-50 transition-colors"
                >
                  Email Sizing Team
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
