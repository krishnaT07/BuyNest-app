import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShoppingBag, MapPin, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <span className="ml-2 text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              BuyNest
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#features" className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
                How It Works
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
                Contact
              </a>
            </div>
          </div>

          {!user && (
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth/login')}>
                Sign In
              </Button>
              <Button variant="hero" size="sm" onClick={() => navigate('/auth/register')}>
                Get Started
              </Button>
            </div>
          )}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/wishlist')}>
                Wishlist
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
            <a href="#features" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              How It Works
            </a>
            <a href="#contact" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Contact
            </a>
            {!user && (
              <div className="pt-4 pb-2 space-y-2">
                <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/auth/login')}>
                  Sign In
                </Button>
                <Button variant="hero" className="w-full justify-start" onClick={() => navigate('/auth/register')}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;