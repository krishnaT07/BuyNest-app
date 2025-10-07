import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useShops } from "@/hooks/useShops";

import { memo } from "react";

const FeaturedShops = () => {
  const { shops, loading, error } = useShops({ limit: 4 });

  if (loading) {
    return (
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Featured Local Shops
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Loading amazing shops in your neighborhood...
            </p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48 mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-muted rounded h-4 w-3/4"></div>
                  <div className="bg-muted rounded h-4 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Featured Local Shops
            </h2>
            <p className="text-lg text-destructive max-w-2xl mx-auto">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Featured Local Shops
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the best shops in your neighborhood with amazing offers and fast delivery
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {shops.map((shop) => (
            <Card key={shop.id} className="overflow-hidden hover:shadow-soft transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="relative overflow-hidden">
                <img
                  src={shop.imageUrl || "/images/shops/default-shop.jpg"}
                  alt={shop.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  srcSet={`${shop.imageUrl || "/images/shops/default-shop.jpg"} 800w`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-background/90 text-foreground">
                    {shop.categories?.[0] || 'Shop'}
                  </Badge>
                </div>
                {shop.minimumOrder && shop.minimumOrder > 0 && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <Badge className="bg-accent text-accent-foreground text-xs">
                      Min order: ₹{shop.minimumOrder}
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{shop.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {shop.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{shop.rating}</span>
                      <span className="text-xs text-muted-foreground">({shop.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {shop.deliveryTime}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{shop.address?.split(',')[0] || 'Location'}</span>
                    </div>
                    <Link to={`/shops/${shop.id}`}>
                      <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        View Shop
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/browse">
            <Button variant="outline" size="lg">
              View All Shops
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default memo(FeaturedShops);