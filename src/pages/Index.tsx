
import React from 'react';
import BookingWizard from '@/components/BookingWizard';
import Footer from '@/components/Footer';

const Index = () => {
  console.log('Index page rendering...');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Digital Services Booking
        </h1>
        <BookingWizard />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
