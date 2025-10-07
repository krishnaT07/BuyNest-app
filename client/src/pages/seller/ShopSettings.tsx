import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useSellerShop } from "@/hooks/useSellerShop";
import { supabase } from "@/integrations/supabase/client";
import { Store, Clock, MapPin, Phone, Mail, Save } from "lucide-react";

const ShopSettings = () => {
  const { shop, loading, refetch } = useSellerShop();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    opening_hours: "",
    delivery_time: "",
    minimum_order: "",
    is_open: true,
  });

  useEffect(() => {
    if (shop) {
      setFormData({
        name: shop.name || "",
        description: shop.description || "",
        address: shop.address || "",
        phone: shop.phone || "",
        email: shop.email || "",
        opening_hours: shop.opening_hours || "",
        delivery_time: shop.delivery_time || "",
        minimum_order: shop.minimum_order?.toString() || "",
        is_open: shop.is_open ?? true,
      });
    }
  }, [shop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!shop) {
        throw new Error("Shop not found");
      }

      // Update shop with approval required for changes
      const { error } = await supabase
        .from('shops')
        .update({
          name: formData.name,
          description: formData.description,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          opening_hours: formData.opening_hours,
          delivery_time: formData.delivery_time,
          minimum_order: formData.minimum_order ? parseFloat(formData.minimum_order) : 0,
          is_open: formData.is_open,
          // Reset approval status if significant changes are made
          is_approved: false,
          approved_at: null,
          approved_by: null,
        })
        .eq('id', shop.id);

      if (error) throw error;

      toast({
        title: "Shop settings updated!",
        description: "Your changes have been submitted for admin approval.",
      });

      refetch();
    } catch (error) {
      console.error('Error updating shop:', error);
      toast({
        title: "Error updating shop",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Shop Found</CardTitle>
          <CardDescription>
            You need to register a shop before you can manage settings.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Store className="w-5 h-5" />
                Shop Settings
              </CardTitle>
              <CardDescription>
                Manage your shop information and settings
              </CardDescription>
            </div>
            <Badge variant={shop.is_approved ? "default" : "secondary"}>
              {shop.is_approved ? "Approved" : "Pending Approval"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Shop Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter shop name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter contact number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your shop..."
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="shop@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minimum_order">Minimum Order (₹)</Label>
                <Input
                  id="minimum_order"
                  type="number"
                  value={formData.minimum_order}
                  onChange={(e) => setFormData({ ...formData, minimum_order: e.target.value })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter full address..."
                rows={2}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="opening_hours" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Opening Hours
                </Label>
                <Input
                  id="opening_hours"
                  value={formData.opening_hours}
                  onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                  placeholder="e.g., 9 AM - 10 PM"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery_time">Delivery Time</Label>
                <Input
                  id="delivery_time"
                  value={formData.delivery_time}
                  onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                  placeholder="e.g., 30-45 minutes"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_open"
                checked={formData.is_open}
                onCheckedChange={(checked) => setFormData({ ...formData, is_open: checked })}
              />
              <Label htmlFor="is_open">Shop is currently open</Label>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Changes will require admin approval before going live
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShopSettings;