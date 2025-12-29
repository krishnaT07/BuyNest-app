"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Store, Clock, MapPin, DollarSign } from "lucide-react";
import { LocationInput } from "@/components/LocationInput";

const RegisterShop = () => {
  const [formData, setFormData] = useState({
    shopName: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    category: "",
    openingHours: "",
    minimumOrder: "",
    deliveryRadius: "",
    acceptsOnlinePayment: false,
    acceptsCashOnDelivery: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const categories = [
    "Grocery & Supermarket",
    "Restaurant & Food",
    "Pharmacy & Healthcare",
    "Electronics & Mobile",
    "Fashion & Clothing",
    "Home & Garden",
    "Books & Stationery",
    "Sports & Fitness",
    "Beauty & Personal Care",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to register your shop.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.shopName || !formData.category || !formData.description || !formData.address || !formData.phone || !formData.email || !formData.openingHours) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const shopData = {
        id: `shop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: formData.shopName,
        description: formData.description,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        opening_hours: formData.openingHours,
        categories: [formData.category],
        minimum_order: formData.minimumOrder ? parseFloat(formData.minimumOrder) : 0,
        owner_id: user.id,
        is_open: true,
        is_approved: false,
        rating: 0,
        review_count: 0,
        delivery_time: "30-45 min",
        image_url: "/images/shops/default-shop.jpg"
      };

      const { error } = await supabase
        .from('shops')
        .insert(shopData);

      if (error) throw error;
      
      toast({
        title: "Shop registered successfully!",
        description: "Your shop has been submitted for admin approval. You'll be notified once it's approved.",
      });
      
      // Navigate to dashboard with success state
      navigate("/seller-dashboard?registered=true");
    } catch (error: any) {
      console.error('Shop registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Store className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h1 className="text-3xl font-bold">Register Your Shop</h1>
            <p className="text-muted-foreground mt-2">
              Join BuyNest and start selling to your local community
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Shop Information</CardTitle>
              <CardDescription>
                Please provide details about your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Shop Name *</Label>
                    <Input
                      id="shopName"
                      placeholder="Enter your shop name"
                      value={formData.shopName}
                      onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Shop Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your shop and what you sell..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <LocationInput
                  label="Shop Address"
                  value={formData.address}
                  onChange={(value) => setFormData({ ...formData, address: value })}
                  placeholder="Enter your complete shop address"
                  required
                  rows={2}
                  helperText="Your shop's physical location for customers to find you"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="shop@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openingHours" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Opening Hours *
                    </Label>
                    <Input
                      id="openingHours"
                      placeholder="e.g., 9:00 AM - 9:00 PM"
                      value={formData.openingHours}
                      onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minimumOrder" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Minimum Order ($)
                    </Label>
                    <Input
                      id="minimumOrder"
                      type="number"
                      placeholder="25"
                      value={formData.minimumOrder}
                      onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryRadius">Delivery Radius (miles)</Label>
                  <Input
                    id="deliveryRadius"
                    type="number"
                    placeholder="5"
                    value={formData.deliveryRadius}
                    onChange={(e) => setFormData({ ...formData, deliveryRadius: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Payment Methods</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="onlinePayment"
                        checked={formData.acceptsOnlinePayment}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, acceptsOnlinePayment: checked as boolean })
                        }
                      />
                      <Label htmlFor="onlinePayment">Accept online payments (Card, UPI, etc.)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="cashOnDelivery"
                        checked={formData.acceptsCashOnDelivery}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, acceptsCashOnDelivery: checked as boolean })
                        }
                      />
                      <Label htmlFor="cashOnDelivery">Accept cash on delivery</Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Register Shop"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterShop;