"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Store, Users, Heart, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">About BuyNest</h1>
            <p className="text-lg text-muted-foreground">
              Connecting local communities through hyperlocal commerce
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-muted-foreground">
                  BuyNest is dedicated to empowering local businesses and making shopping convenient 
                  for communities. We believe in supporting neighborhood shops and bringing fresh 
                  products directly to your doorstep.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <Store className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Support Local Shops</h3>
                      <p className="text-sm text-muted-foreground">
                        We help local businesses reach more customers and grow their online presence.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Users className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Community First</h3>
                      <p className="text-sm text-muted-foreground">
                        Building stronger communities by connecting buyers with nearby sellers.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Heart className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Fresh & Fast</h3>
                      <p className="text-sm text-muted-foreground">
                        Quick delivery of fresh products from local shops to your home.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Award className="h-8 w-8 text-primary flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Quality Assured</h3>
                      <p className="text-sm text-muted-foreground">
                        We ensure all shops meet our quality standards for your peace of mind.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;

