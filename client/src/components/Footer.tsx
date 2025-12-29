import { Link } from "react-router-dom";
import { Store, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Store className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">BuyNest</span>
            </Link>
            <p className="text-muted-foreground">
              Your hyperlocal marketplace connecting you with nearby shops and fresh products.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
              <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/shops" className="block text-muted-foreground hover:text-foreground">
                Browse Shops
              </Link>
              <Link to="/browse" className="block text-muted-foreground hover:text-foreground">
                Browse Products
              </Link>
              <Link to="/browse" className="block text-muted-foreground hover:text-foreground">
                Deals & Offers
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-foreground">
                About Us
              </Link>
            </div>
          </div>

          {/* For Business */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Business</h3>
            <div className="space-y-2">
              <Link to="/shops/register" className="block text-muted-foreground hover:text-foreground">
                Become a Seller
              </Link>
              <Link to="/seller-resources" className="block text-muted-foreground hover:text-foreground">
                Seller Resources
              </Link>
              <Link to="/business-support" className="block text-muted-foreground hover:text-foreground">
                Business Support
              </Link>
              <Link to="/partner-program" className="block text-muted-foreground hover:text-foreground">
                Partner Program
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@buynest.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Downtown, City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-muted-foreground text-sm">
              © 2024 BuyNest. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-muted-foreground hover:text-foreground">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;