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
import { useSellerProducts } from "@/hooks/useSellerProducts";
import { useSellerShop } from "@/hooks/useSellerShop";
import { Package, Upload, DollarSign } from "lucide-react";

const NewProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    originalPrice: "",
    weight: "",
    sku: "",
    inStock: true,
    featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { createProduct } = useSellerProducts();
  const { shop, loading: shopLoading } = useSellerShop();
  const navigate = useNavigate();

  const categories = [
    "Fruits & Vegetables",
    "Dairy & Eggs",
    "Meat & Seafood",
    "Bakery & Bread",
    "Pantry & Dry Goods",
    "Beverages",
    "Snacks & Confectionery",
    "Health & Personal Care",
    "Household & Cleaning",
    "Electronics",
    "Clothing & Accessories",
    "Books & Stationery",
    "Other",
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if shop is approved
    if (!shop || !shop.is_approved) {
      toast({
        title: "Shop Not Approved",
        description: "You cannot add products until your shop is approved by our admin team.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.category || !formData.price) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Create product data
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        weight: formData.weight,
        sku: formData.sku,
        inStock: formData.inStock,
        isFeatured: formData.featured,
        imageUrl: '/images/products/default-product.jpg', // TODO: Handle file upload
        shopId: '', // Will be set by the hook
        nutritionInfo: null,
      };

      await createProduct(productData);
      
      toast({
        title: "Product added successfully!",
        description: "Your product is now available in your shop.",
      });
      
      navigate("/seller-dashboard");
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Failed to add product",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking shop status
  if (shopLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading shop information...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if shop is approved
  if (!shop || !shop.is_approved) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center py-16">
              <Package className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
              <h1 className="text-2xl font-bold mb-4">Shop Not Approved Yet</h1>
              <p className="text-muted-foreground mb-6">
                You cannot add products until your shop is approved by our admin team.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-sm text-left mb-6">
                <p className="font-semibold mb-2 text-yellow-800">What you can do:</p>
                <ul className="space-y-1 text-yellow-700">
                  <li>• Wait for admin approval of your shop</li>
                  <li>• Edit your shop details if needed</li>
                  <li>• Prepare your product information</li>
                </ul>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/seller-dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Package className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h1 className="text-3xl font-bold">Add New Product</h1>
            <p className="text-muted-foreground mt-2">
              Add a new product to your shop inventory
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>
                Provide information about your product
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      placeholder="Product SKU (optional)"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Price *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight/Unit</Label>
                    <Input
                      id="weight"
                      placeholder="e.g., 1 lb, 500g"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Product Image
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  {imageFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {imageFile.name}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-semibold">Product Options</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="inStock"
                        checked={formData.inStock}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, inStock: checked as boolean })
                        }
                      />
                      <Label htmlFor="inStock">In Stock</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, featured: checked as boolean })
                        }
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/seller-dashboard")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Adding Product..." : "Add Product"}
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

export default NewProduct;