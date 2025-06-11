
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Simple basename detection for cPanel deployment
const getBasename = () => {
  const baseUrl = import.meta.env.BASE_URL;
  
  // Debug logging
  console.log('BASE_URL from import.meta.env:', baseUrl);
  console.log('Current window location:', window.location.pathname);
  console.log('Current window origin:', window.location.origin);
  
  // If BASE_URL is set to something other than '/', use it
  if (baseUrl && baseUrl !== '/') {
    const cleanBasename = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    console.log('Using basename:', cleanBasename);
    return cleanBasename;
  }
  
  // For production, try to detect from current path
  if (import.meta.env.PROD) {
    const pathname = window.location.pathname;
    console.log('Production mode, pathname:', pathname);
    
    // If we're in a subdirectory like /book/, extract it
    const pathParts = pathname.split('/').filter(Boolean);
    if (pathParts.length > 0 && pathParts[0] !== 'index.html') {
      const detectedBase = `/${pathParts[0]}`;
      console.log('Detected basename from URL:', detectedBase);
      return detectedBase;
    }
  }
  
  console.log('Using default basename: undefined (root)');
  return undefined;
};

const basename = getBasename();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
