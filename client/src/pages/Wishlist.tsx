"use client";
import { useWishlist } from "@/context/WishlistContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

const Wishlist = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Start adding items you love!</p>
            <Link to="/browse">
              <Button size="lg" className="bg-gradient-primary">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 sm:py-8 w-full">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">My Wishlist</h1>
              <p className="text-muted-foreground">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
            </div>
            {items.length > 0 && (
              <Button 
                variant="outline" 
                onClick={clearWishlist}
                className="touch-manipulation"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {items.map(item => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all border-primary/10 group">
              <Link to={`/products/${item.id}`} className="block">
                <div className="aspect-square bg-muted overflow-hidden relative">
                  <img 
                    src={item.imageUrl || "/images/products/default-product.jpg"} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => { 
                      (e.currentTarget as HTMLImageElement).src = "/images/products/default-product.jpg"; 
                    }}
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity touch-manipulation"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFromWishlist(item.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Link>
              <CardContent className="p-4 space-y-3">
                <Link to={`/products/${item.id}`}>
                  <p className="font-semibold hover:text-primary transition-colors line-clamp-2">{item.name}</p>
                </Link>
                {item.price && (
                  <p className="text-lg font-bold text-primary">₹{item.price.toLocaleString()}</p>
                )}
                <div className="flex gap-2">
                  <Link to={`/products/${item.id}`} className="flex-1">
                    <Button size="sm" className="w-full touch-manipulation">View</Button>
                  </Link>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => removeFromWishlist(item.id)}
                    className="touch-manipulation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;


