import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProductRatingsProps {
  products: any[];
}

export const ProductRatings = ({ products }: ProductRatingsProps) => {
  // Mock rating data - in real app, fetch from backend
  const ratingBreakdown = {
    5: 45,
    4: 30,
    3: 15,
    2: 7,
    1: 3
  };

  const averageRating = 4.2;
  const totalReviews = 100;

  const topRatedProducts = products?.slice(0, 5).map(product => ({
    ...product,
    rating: (Math.random() * 2 + 3).toFixed(1), // Mock rating 3-5
    reviews: Math.floor(Math.random() * 50) + 10 // Mock reviews
  })) || [];

  return (
    <div className="space-y-6">
      {/* Overall Rating */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Shop Rating</CardTitle>
          <CardDescription>Based on customer reviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Average Rating Display */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-6xl font-bold">{averageRating}</div>
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-muted-foreground mt-2">{totalReviews} reviews</p>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{stars}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress 
                    value={ratingBreakdown[stars as keyof typeof ratingBreakdown]} 
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-12">
                    {ratingBreakdown[stars as keyof typeof ratingBreakdown]}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Rated Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Rated Products
          </CardTitle>
          <CardDescription>Your best performing products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topRatedProducts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No products found. Add products to see ratings.
              </div>
            ) : (
              topRatedProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image_url || "/images/products/default-product.jpg"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h4 className="font-semibold">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{product.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          ({product.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">₹{product.price}</p>
                    <Badge variant={product.in_stock ? "default" : "secondary"} className="mt-1">
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
