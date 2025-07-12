
import React from 'react';
import BookingWizard from '@/components/BookingWizard';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <BookingWizard />
      <Footer />
    </div>
  );
};

export default Index;
