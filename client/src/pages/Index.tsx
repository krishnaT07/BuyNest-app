"use client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RoleSelection from "@/components/RoleSelection";
import FeaturedShops from "@/components/FeaturedShops";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import RecentlyViewedCarousel from "@/components/RecentlyViewedCarousel";
import { useNavigate } from "react-router-dom";
import { memo, useCallback } from "react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const goBuyer = useCallback(() => navigate('/buyer-dashboard'), [navigate]);
  const goSeller = useCallback(() => navigate('/seller-dashboard'), [navigate]);
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedShops />
      {!user && <RoleSelection />}
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              How BuyNest Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to start shopping locally or selling to your neighborhood
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold">Choose Your Location</h3>
              <p className="text-muted-foreground">
                Set your delivery location to discover nearby shops and local businesses
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-accent">2</span>
              </div>
              <h3 className="text-xl font-semibold">Browse & Order</h3>
              <p className="text-muted-foreground">
                Explore local shops, add items to cart, and place your order with easy payment
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold">Quick Delivery</h3>
              <p className="text-muted-foreground">
                Get your order delivered to your doorstep in 15-30 minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-muted/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Recently viewed */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-4">Recently Viewed</h3>
            <RecentlyViewedCarousel />
          </div>
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Ready to Start?</h2>
            <p className="text-muted-foreground">
              Join thousands of users already using BuyNest for local shopping
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={goBuyer}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-hero text-primary-foreground hover:shadow-strong transform hover:scale-105 transition-all duration-300 h-11 rounded-md px-8"
                >
                  Start Shopping
                </button>
                <button 
                  onClick={goSeller}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 rounded-md px-8"
                >
                  Become a Seller
                </button>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default memo(Index);
