import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Product, Shop } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingCart, Store, Star, Truck } from "lucide-react";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [shop, setShop] = useState<Shop | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // Mock data - replace with actual API call
        const mockProduct: Product = {
          id: productId!,
          name: "Fresh Organic Bananas",
          description: "Premium quality organic bananas, perfectly ripe and sweet. Rich in potassium and essential nutrients. Perfect for breakfast, smoothies, or healthy snacking.",
          price: 2.99,
          originalPrice: 3.49,
          category: "Fruits & Vegetables",
          imageUrl: "/images/products/fruits/apple.jpg",
          inStock: true,
          shopId: "shop1",
          sku: "BAN001",
          weight: "1 lb",
          nutritionInfo: {
            calories: 105,
            protein: "1.3g",
            carbs: "27g",
            fiber: "3.1g",
            sugar: "14g",
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const mockShop: Shop = {
          id: "shop1",
          name: "Fresh Mart Grocery",
          description: "Your neighborhood grocery store",
          address: "123 Main Street, Downtown",
          phone: "+1 (555) 123-4567",
          email: "info@freshmart.com",
          rating: 4.5,
          reviewCount: 128,
          openingHours: "8:00 AM - 10:00 PM",
          categories: ["Grocery"],
          isOpen: true,
          deliveryTime: "30-45 mins",
          minimumOrder: 25,
          ownerId: "owner1",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        setProduct(mockProduct);
        setShop(mockShop);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load product details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, toast]);

  const handleAddToCart = () => {
    if (product && shop) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        shopId: product.shopId,
        shopName: shop.name,
        imageUrl: product.imageUrl,
      });
      
      toast({
        title: "Added to cart",
        description: `${quantity} ${product.name} added to your cart.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product || !shop) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
          <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600 mt-2">{product.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">{product.category}</Badge>
              {product.inStock ? (
                <Badge variant="default">In Stock</Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">${product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <Badge variant="destructive" className="text-xs">
                      {discountPercentage}% OFF
                    </Badge>
                  </>
                )}
              </div>
              {product.weight && (
                <p className="text-sm text-gray-600">Weight: {product.weight}</p>
              )}
            </div>

            <Separator />

            {/* Store Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Store className="h-5 w-5 text-gray-600" />
                    <div>
                      <Link 
                        to={`/shops/${shop.id}`}
                        className="font-semibold hover:text-primary"
                      >
                        {shop.name}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{shop.rating}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          <span>{shop.deliveryTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>
            </div>

            {/* Nutrition Info */}
            {product.nutritionInfo && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Nutrition Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Calories: {product.nutritionInfo.calories}</div>
                    <div>Protein: {product.nutritionInfo.protein}</div>
                    <div>Carbs: {product.nutritionInfo.carbs}</div>
                    <div>Fiber: {product.nutritionInfo.fiber}</div>
                    <div>Sugar: {product.nutritionInfo.sugar}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;