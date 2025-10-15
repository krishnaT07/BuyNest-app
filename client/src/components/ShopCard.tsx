"use client";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shop } from "@/types";
import { MapPin, Clock, Star, Phone, ShoppingBag, Eye } from "lucide-react";

interface ShopCardProps {
  shop: Shop;
  viewMode?: "grid" | "list";
}

const ShopCard = ({ shop, viewMode = "grid" }: ShopCardProps) => {
  if (viewMode === "list") {
    return (
      <Link to={`/shops/${shop.id}`}>
        <Card className="overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border-primary/10 bg-gradient-to-r from-card to-muted/30 animate-fade-in group">
          <div className="flex">
            <div className="relative w-48 h-32 flex-shrink-0">
              <img
                src={shop.imageUrl || "/images/shops/default-shop.jpg"}
                alt={shop.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
              <Badge className="absolute top-2 left-2 bg-gradient-primary text-white shadow-soft">
                {shop.categories?.[0] || 'Shop'}
              </Badge>
            </div>
            <CardContent className="p-4 flex-1">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{shop.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{shop.rating}</span>
                    <span className="text-xs text-muted-foreground">({shop.reviewCount})</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">{shop.description}</p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{shop.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{shop.address?.split(',')[0] || 'Location'}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <Badge variant="outline" className="text-xs">
                    Min. Order: ₹{shop.minimumOrder}
                  </Badge>
                  <Button size="sm" variant="outline" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="h-4 w-4 mr-1" />
                    View Shop
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/shops/${shop.id}`}>
      <Card className="overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border-primary/10 bg-gradient-to-br from-card to-muted/30 animate-fade-in group">
        <div className="relative">
          <img
            src={shop.imageUrl || "/images/shops/default-shop.jpg"}
            alt={shop.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
          <Badge className="absolute top-3 left-3 bg-gradient-primary text-white shadow-soft">
            {shop.categories?.[0] || 'Shop'}
          </Badge>
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" className="bg-background/90 backdrop-blur-sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{shop.name}</h3>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{shop.rating}</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2">{shop.description}</p>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{shop.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{shop.address?.split(',')[0] || 'Location'}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <Badge variant="outline" className="text-xs">
                Min. Order: ₹{shop.minimumOrder}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>{shop.phone}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {shop.categories?.slice(0, 3).map((category) => (
                <Badge key={category} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
              {shop.categories && shop.categories.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{shop.categories.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ShopCard;