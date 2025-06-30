import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeft, Users, Target, Award, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const AboutPage = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-pink-600" />,
      title: "Quality First",
      description: "We never compromise on quality. Every piece is carefully crafted with premium materials."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Customer Centric",
      description: "Our customers are at the heart of everything we do. Your satisfaction is our success."
    },
    {
      icon: <Target className="w-8 h-8 text-green-600" />,
      title: "Innovation",
      description: "We continuously innovate to bring you the latest trends and timeless classics."
    },
    {
      icon: <Award className="w-8 h-8 text-purple-600" />,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our business, from design to delivery."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About FashionStore
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're passionate about bringing you the finest fashion that combines comfort, style, and quality. 
            Our journey began with a simple mission: to make premium fashion accessible to everyone.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Founded in 2020, FashionStore started as a dream to revolutionize the way people 
                experience fashion. We noticed a gap in the market for high-quality, comfortable 
                clothing that doesn't compromise on style.
              </p>
              <p>
                From our humble beginnings in a small studio, we've grown into a trusted brand 
                that serves thousands of customers across the country. Our team of designers and 
                quality experts work tirelessly to ensure every piece meets our high standards.
              </p>
              <p>
                Today, we're proud to offer a comprehensive range of clothing for men and women, 
                from everyday essentials to special occasion wear. Each item is thoughtfully 
                designed and carefully crafted to provide you with the best possible experience.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">👕</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Premium Fashion</h3>
              <p className="text-gray-600">Crafted with care, designed for life</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape the way we serve our customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
              <p className="text-gray-600">Products</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">5+</div>
              <p className="text-gray-600">Years Experience</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-2">99%</div>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl leading-relaxed max-w-4xl mx-auto">
            To provide exceptional fashion that empowers individuals to express their unique style 
            while feeling comfortable and confident. We believe that great fashion should be accessible, 
            sustainable, and created with genuine care for our customers and the environment.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
