import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shop } from "@/types";
import { Star, Clock, MapPin } from "lucide-react";

interface ShopCardProps {
  shop: Shop;
}

const ShopCard = ({ shop }: ShopCardProps) => {
  return (
    <Link to={`/shops/${shop.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-1">{shop.name}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                {shop.description}
              </CardDescription>
            </div>
            <Badge variant={shop.isOpen ? "default" : "destructive"} className="ml-2">
              {shop.isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Rating and Delivery Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{shop.rating}</span>
              <span className="text-muted-foreground">({shop.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{shop.deliveryTime}</span>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-muted-foreground line-clamp-2">{shop.address}</span>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1">
            {shop.categories.slice(0, 3).map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
            {shop.categories.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{shop.categories.length - 3} more
              </Badge>
            )}
          </div>

          {/* Minimum Order */}
          {shop.minimumOrder > 0 && (
            <div className="text-sm text-muted-foreground">
              Min order: ${shop.minimumOrder}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ShopCard;