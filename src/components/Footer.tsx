
import React from 'react';
import { Link } from 'react-router-dom';
import { Copyright } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-4 mt-8 border-t bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-sm text-muted-foreground space-y-2">
          <div className="flex items-center">
            <Copyright className="w-4 h-4 mr-1" />
            <span>{currentYear} Rbibihas Groupe</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/privacy-policy" className="hover:text-primary underline">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-primary underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
