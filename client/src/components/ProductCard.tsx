"use client";
import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Plus, Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: Product;
  shopName?: string;
}

const ProductCard = ({ product, shopName }: ProductCardProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();
    
    setIsAdding(true);
    
    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        shopId: product.shopId,
        shopName: shopName || "Unknown Shop",
        imageUrl: product.imageUrl,
      });
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  }, [product, shopName, addToCart, toast]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/images/products/default-product.jpg";
  }, []);

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="relative">
          <div className="aspect-square bg-gray-100 overflow-hidden rounded-t-lg">
            <img
              src={product.imageUrl || "/images/products/default-product.jpg"}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
              decoding="async"
              onError={handleImageError}
            />
          </div>
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              {discountPercentage}% OFF
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
              <Badge variant="secondary" className="text-white bg-gray-800">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            <p className="text-xs text-muted-foreground line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-lg text-primary">
                    ${product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                {product.weight && (
                  <span className="text-xs text-muted-foreground">
                    {product.weight}
                  </span>
                )}
              </div>
              
              <button
                aria-label="Toggle wishlist"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist({ id: product.id, name: product.name, imageUrl: product.imageUrl, price: product.price }); }}
                className={`p-1 rounded ${isInWishlist(product.id) ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className="w-full"
            size="sm"
          >
            {isAdding ? (
              "Adding..."
            ) : (
              <>
                {product.inStock ? (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </>
                ) : (
                  "Out of Stock"
                )}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;