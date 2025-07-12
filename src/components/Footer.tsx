
import React from 'react';
import { Copyright } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-4 mt-8 border-t bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <Copyright className="w-4 h-4 mr-1" />
          <span>{currentYear} Rbibihas Groupe</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
