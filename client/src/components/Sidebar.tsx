import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  ShoppingBag,
  Store,
  Users,
  Package,
  BarChart3,
  Settings,
  Heart,
  Bell,
  CreditCard,
  MapPin,
  HelpCircle,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const getNavigationItems = () => {
    if (!user) return [];

    switch (user.role) {
      case "admin":
        return [
          { name: "Dashboard", href: "/admin-dashboard", icon: Home },
          { name: "Users", href: "/admin/users", icon: Users },
          { name: "Shops", href: "/admin/shops", icon: Store },
          { name: "Products", href: "/admin/products", icon: Package },
          { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
          { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
          { name: "Settings", href: "/admin/settings", icon: Settings },
        ];

      case "seller":
        return [
          { name: "Dashboard", href: "/seller-dashboard", icon: Home },
          { name: "My Shop", href: "/seller/shop", icon: Store },
          { name: "Products", href: "/seller/products", icon: Package },
          { name: "Orders", href: "/seller/orders", icon: ShoppingBag },
          { name: "Analytics", href: "/seller/analytics", icon: BarChart3 },
          { name: "Add Product", href: "/products/new", icon: Package },
          { name: "Settings", href: "/seller/settings", icon: Settings },
        ];

      case "buyer":
      default:
        return [
          { name: "Dashboard", href: "/buyer-dashboard", icon: Home },
          { name: "Browse Shops", href: "/shops", icon: Store },
          { name: "My Orders", href: "/buyer/orders", icon: ShoppingBag },
          { name: "Wishlist", href: "/buyer/wishlist", icon: Heart },
          { name: "Notifications", href: "/buyer/notifications", icon: Bell },
          { name: "Addresses", href: "/buyer/addresses", icon: MapPin },
          { name: "Payment Methods", href: "/buyer/payments", icon: CreditCard },
          { name: "Help & Support", href: "/help", icon: HelpCircle },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="flex h-full w-64 flex-col bg-background border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold">
          {user?.role === "admin" && "Admin Panel"}
          {user?.role === "seller" && "Seller Center"}
          {user?.role === "buyer" && "My Account"}
        </h2>
      </div>
      
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive && "bg-secondary"
                )}
                asChild
              >
                <Link to={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;