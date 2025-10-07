import { useWishlist } from "@/context/WishlistContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground">Your wishlist is empty</p>
          <Link to="/browse"><Button>Browse</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        <Button variant="outline" onClick={clearWishlist}>Clear All</Button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-square bg-muted">
              <img src={item.imageUrl || "/images/products/default-product.jpg"} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-4 space-y-2">
              <p className="font-semibold">{item.name}</p>
              {item.price ? <p className="text-sm text-muted-foreground">₹{item.price}</p> : null}
              <div className="flex gap-2">
                <Link to={`/products/${item.id}`}><Button size="sm">View</Button></Link>
                <Button size="sm" variant="outline" onClick={() => removeFromWishlist(item.id)}>Remove</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;


