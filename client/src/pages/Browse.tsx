"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock,
  Grid3X3,
  List,
  ChevronDown,
  Truck,
  ShoppingBag
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useDeliveryMode } from "@/context/DeliveryModeContext";
import { useShops } from "@/hooks/useShops";
import { useProducts } from "@/hooks/useProducts";

const categories = [
  "All Categories", "Grocery", "Electronics", "Clothing", "Food & Drinks", 
  "Health & Beauty", "Home & Garden", "Sports", "Books"
];

const Browse = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { deliveryMode, setDeliveryMode } = useDeliveryMode();
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"shops" | "products">("shops");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  
  // Use custom hooks for data fetching
  const { shops, loading: shopsLoading, error: shopsError } = useShops({
    category: selectedCategory,
    searchQuery: searchQuery,
    sortBy: sortBy
  });

  const { products, loading: productsLoading, error: productsError } = useProducts({
    category: selectedCategory,
    searchQuery: searchQuery,
    priceRange: priceRange,
    sortBy: sortBy
  });

  const loading = activeTab === "shops" ? shopsLoading : productsLoading;
  const error = activeTab === "shops" ? shopsError : productsError;
  const { addToCart } = useCart();

  const handleSearch = () => {
    // Trigger search by updating the dependencies
    setSearchQuery(searchQuery);
  };

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                {initialQuery ? `Search results for "${initialQuery}"` : "Browse Local Shops"}
              </h1>
              <p className="text-muted-foreground text-lg">
                Discover amazing local businesses in your area
              </p>
            </div>
            
            {/* Delivery Mode Toggle */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-muted to-muted/50 p-1.5 rounded-xl shadow-soft border border-border/50">
              <Button
                variant={deliveryMode === "delivery" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDeliveryMode("delivery")}
                className="flex items-center gap-2 rounded-lg hover:scale-105 transition-transform"
              >
                <Truck className="h-4 w-4" />
                Delivery
              </Button>
              <Button
                variant={deliveryMode === "pickup" ? "default" : "ghost"}
                size="sm"
                onClick={() => setDeliveryMode("pickup")}
                className="flex items-center gap-2 rounded-lg hover:scale-105 transition-transform"
              >
                <ShoppingBag className="h-4 w-4" />
                Pickup
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-2 mt-6">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search shops or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="default" onClick={handleSearch}>Search</Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
              <Card className="shadow-soft border-primary/10 hover:shadow-strong transition-shadow">
                <CollapsibleTrigger asChild>
                  <CardHeader className="bg-gradient-to-br from-primary/5 to-transparent cursor-pointer hover:bg-primary/10 transition-colors">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-primary" />
                        Filters
                      </div>
                      <ChevronDown 
                        className={`h-5 w-5 text-muted-foreground transition-transform ${
                          filtersOpen ? "rotate-180" : ""
                        }`}
                      />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="space-y-6 pt-6">
                    {/* Category Filter */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">Category</label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger>
                          <SelectValue />
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

                    {/* Price Range */}
<div>
  <label className="text-sm font-medium mb-3 block">
    Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
  </label>
  <Slider
    value={priceRange}
    onValueChange={setPriceRange}
    max={10000}
    min={0}
    step={100}
    className="w-full"
  />
</div>

{/* Sort By */}
<div>
  <label className="text-sm font-medium mb-3 block">Sort By</label>
  <Select value={sortBy} onValueChange={setSortBy}>
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="relevance">Relevance</SelectItem>
      <SelectItem value="rating">Highest Rated</SelectItem>
      <SelectItem value="distance">Nearest First</SelectItem>
      <SelectItem value="delivery-time">Fastest Delivery</SelectItem>
      <SelectItem value="price-low">Price: Low to High</SelectItem>
      <SelectItem value="price-high">Price: High to Low</SelectItem>
    </SelectContent>
  </Select>
</div>


                    {/* Availability & Rating */}
                    <div>
                      <label className="text-sm font-medium mb-3 block">Availability</label>
                      <div className="flex items-center gap-2">
                        <input id="instock" type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
                        <label htmlFor="instock" className="text-sm">In stock only</label>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-3 block">Minimum Rating</label>
                      <Select value={minRating ? String(minRating) : ''} onValueChange={(v) => setMinRating(v ? Number(v) : null)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any</SelectItem>
                          <SelectItem value="3">3★ & up</SelectItem>
                          <SelectItem value="4">4★ & up</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setSelectedCategory("All Categories");
                        setPriceRange([0, 10000]);
                        setSortBy("relevance");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tab Navigation */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                <Button
                  variant={activeTab === "shops" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("shops")}
                  className="rounded-md"
                >
                  Shops ({loading ? "..." : shops.length})
                </Button>
                <Button
                  variant={activeTab === "products" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("products")}
                  className="rounded-md"
                >
                  Products ({loading ? "..." : products.length})
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-8">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {/* Results */}
            {!loading && !error && (
              <>
                {activeTab === "shops" ? (
                  <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                    {shops.length === 0 ? (
                      <div className="col-span-full text-center py-8">
                        <p className="text-muted-foreground">No shops found matching your criteria.</p>
                      </div>
                    ) : (
                      shops.map((shop) => (
                        <Link key={shop.id} to={`/shops/${shop.id}`}>
                        <Card className="overflow-hidden hover:shadow-strong hover:-translate-y-1 transition-all cursor-pointer border-primary/10 bg-gradient-to-br from-card to-muted/30 animate-fade-in">
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
                          </div>
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">{shop.name}</h3>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">{shop.rating}</span>
                                </div>
                              </div>
                              
                              <p className="text-sm text-muted-foreground line-clamp-2">{shop.description}</p>
                              
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {deliveryMode === "pickup" ? "Ready for pickup" : shop.deliveryTime}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {shop.address?.split(',')[0] || 'Location'}
                                </div>
                              </div>
                              
                              <Badge variant="outline" className="mt-2">
                                {deliveryMode === "pickup" ? "Pickup Available" : "Delivery Available"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                        </Link>
                      ))
                    )}
                  </div>
                ) : (
                  <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                    {products.length === 0 ? (
                      <div className="col-span-full text-center py-8">
                        <p className="text-muted-foreground">No products found matching your criteria.</p>
                      </div>
                    ) : (
                      products
                        .filter(p => !inStockOnly || p.inStock)
                        .filter(p => {
                          if (!minRating) return true;
                          return true; // placeholder if rating exists later
                        })
                        .map((product) => (
                        <Card key={product.id} className="overflow-hidden hover:shadow-strong hover:-translate-y-1 transition-all cursor-pointer border-primary/10 bg-gradient-to-br from-card to-muted/30 animate-fade-in group">
                          <div className="relative overflow-hidden">
                            <img
                              src={product.imageUrl || "/images/products/default-product.jpg"}
                              alt={product.name}
                              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                              decoding="async"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/products/default-product.jpg"; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <Link to={`/products/${product.id}`} className="font-semibold hover:text-primary transition-colors">{product.name}</Link>
                              <p className="text-sm text-muted-foreground">{(product as any).shops?.name || 'Shop'}</p>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-primary">
                                  {formatPrice(Number(product.price))}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    {formatPrice(Number(product.originalPrice))}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Button className="bg-gradient-primary hover:opacity-90 hover:scale-105 transition-all shadow-soft" size="sm"
                                  onClick={() => addToCart({
                                    id: product.id,
                                    name: product.name,
                                    price: Number(product.price),
                                    quantity: 1,
                                    shopId: (product as any).shopId || 'unknown',
                                    shopName: ((product as any).shops?.name) || 'Shop',
                                    imageUrl: product.imageUrl || "/images/products/default-product.jpg",
                                  })}
                                >
                                  Add to Cart
                                </Button>
                                <div className="flex items-center gap-2 text-xs">
                                  <input
                                    type="checkbox"
                                    checked={compareIds.includes(product.id)}
                                    onChange={(e) => setCompareIds(prev => e.target.checked ? [...prev, product.id] : prev.filter(id => id !== product.id))}
                                  />
                                  <span>Compare</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      {compareIds.length > 0 && (
        <div className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-4 md:w-[420px] p-3 rounded-xl border bg-background shadow-strong">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">Compare products ({compareIds.length})</p>
            <Button variant="ghost" size="sm" onClick={() => setCompareIds([])}>Clear</Button>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Open each in new tab to compare specs.</div>
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {compareIds.map(id => (
              <Link key={id} to={`/products/${id}`} className="px-2 py-1 rounded border text-xs hover:bg-muted">#{id}</Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;