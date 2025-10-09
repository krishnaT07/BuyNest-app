"use client";
import { Button } from "@/components/ui/button";
import { MapPin, ShoppingBag, Truck, Users } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { memo, useCallback } from "react";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goRegister = useCallback(() => navigate('/auth/register'), [navigate]);
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <MapPin className="w-4 h-4 mr-2" />
                Hyperlocal Shopping Made Easy
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Shop{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Local
                </span>
                ,{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Fast
                </span>{" "}
                & Fresh
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Discover local shops in your neighborhood. From groceries to electronics, 
                get everything delivered to your doorstep in minutes.
              </p>
            </div>

            {/* CTA Buttons */}
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" className="text-lg" onClick={goRegister}>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Start Shopping
                </Button>
                <Button variant="outline" size="xl" className="text-lg" onClick={goRegister}>
                  <Users className="w-5 h-5 mr-2" />
                  Become a Seller
                </Button>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Local Shops</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">15min</div>
                <div className="text-sm text-muted-foreground">Avg Delivery</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-strong" aria-hidden>
              <img
                src={heroImage}
                alt="Local shopping experience"
                className="w-full h-auto"
                decoding="async"
                fetchpriority="high"
                sizes="(max-width: 1024px) 100vw, 50vw"
                srcSet={`${heroImage} 1200w`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-card rounded-lg p-4 shadow-soft border">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Fast Delivery</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-card rounded-lg p-4 shadow-soft border">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">Local Shops</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Hero);