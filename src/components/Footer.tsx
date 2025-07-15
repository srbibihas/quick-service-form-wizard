
import React from 'react';

const Footer = () => {
  console.log('Footer component rendering...');
  
  return (
    <footer className="mt-16 py-8 border-t bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600">
          <p>&copy; 2025 Digital Services Booking. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900">Terms of Service</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
