import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { DeliveryModeProvider } from "@/context/DeliveryModeContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AddressBookProvider } from "@/context/AddressBookContext";
import AdminRedirect from "@/components/AdminRedirect";
import SellerRedirect from "@/components/SellerRedirect";
import SellerRouteProtection from "@/components/SellerRouteProtection";
import BuyerRedirect from "@/components/BuyerRedirect";
import { lazy, Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

// Eager load: critical pages
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";

// Lazy load: secondary pages for code splitting
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const BuyerDashboard = lazy(() => import("./pages/BuyerDashboard"));
const SellerDashboard = lazy(() => import("./pages/SellerDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ShopDetails = lazy(() => import("./pages/shops/ShopDetails"));
const RegisterShop = lazy(() => import("./pages/shops/RegisterShop"));
const ProductDetails = lazy(() => import("./pages/products/ProductDetails"));
const NewProduct = lazy(() => import("./pages/products/NewProduct"));
const Browse = lazy(() => import("./pages/Browse"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Cart = lazy(() => import("./pages/Cart"));
const Orders = lazy(() => import("./pages/Orders"));
const Profile = lazy(() => import("./pages/Profile"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCancel = lazy(() => import("./pages/PaymentCancel"));
const PaymentProcessing = lazy(() => import("./pages/PaymentProcessing"));
const Wishlist = lazy(() => import("./pages/Wishlist"));

// Buyer pages
const BrowseShops = lazy(() => import("./pages/buyer/BrowseShops"));
const BuyerOrders = lazy(() => import("./pages/buyer/BuyerOrders"));
const BuyerWishlist = lazy(() => import("./pages/buyer/BuyerWishlist"));
const Notifications = lazy(() => import("./pages/buyer/Notifications"));
const Addresses = lazy(() => import("./pages/buyer/Addresses"));
const Payments = lazy(() => import("./pages/buyer/Payments"));

// Seller pages
const SellerShop = lazy(() => import("./pages/seller/SellerShop"));
const SellerProducts = lazy(() => import("./pages/seller/SellerProducts"));
const SellerOrders = lazy(() => import("./pages/seller/SellerOrders"));
const SellerAnalytics = lazy(() => import("./pages/seller/SellerAnalytics"));
const SellerSettings = lazy(() => import("./pages/seller/SellerSettings"));

// Admin pages
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminShops = lazy(() => import("./pages/admin/AdminShops"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

// Footer pages
const Help = lazy(() => import("./pages/Help"));
const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <AuthProvider>
          <DeliveryModeProvider>
            <WishlistProvider>
            <AddressBookProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <ErrorBoundary>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/auth/register" element={<Register />} />
                    <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                    <Route path="/auth/reset-password" element={<ResetPassword />} />
                    <Route path="/shops/:shopId" element={<ShopDetails />} />
                    <Route path="/shops/register" element={<RegisterShop />} />
                    <Route path="/products/:productId" element={<ProductDetails />} />
                    <Route path="/products/new" element={<NewProduct />} />
                    <Route path="/browse" element={<Browse />} />
                    <Route path="/search" element={<Browse />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<BuyerRedirect><Orders /></BuyerRedirect>} />
                    <Route path="/profile" element={<BuyerRedirect><Profile /></BuyerRedirect>} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-cancel" element={<PaymentCancel />} />
                    <Route path="/payment-processing" element={<PaymentProcessing />} />
                    <Route path="/wishlist" element={<BuyerRedirect><Wishlist /></BuyerRedirect>} />
                    <Route path="/buyer-dashboard" element={<BuyerRedirect><BuyerDashboard /></BuyerRedirect>} />
                    <Route path="/seller-dashboard" element={<SellerRedirect><SellerDashboard /></SellerRedirect>} />
                    <Route path="/admin-dashboard" element={<AdminRedirect><AdminDashboard /></AdminRedirect>} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/users" element={<AdminRedirect><AdminUsers /></AdminRedirect>} />
                    <Route path="/admin/shops" element={<AdminRedirect><AdminShops /></AdminRedirect>} />
                    <Route path="/admin/products" element={<AdminRedirect><AdminProducts /></AdminRedirect>} />
                    <Route path="/admin/orders" element={<AdminRedirect><AdminOrders /></AdminRedirect>} />
                    <Route path="/admin/analytics" element={<AdminRedirect><AdminAnalytics /></AdminRedirect>} />
                    <Route path="/admin/settings" element={<AdminRedirect><AdminSettings /></AdminRedirect>} />
                    
                    {/* Seller Routes */}
                    <Route path="/seller/shop" element={<SellerRedirect><SellerShop /></SellerRedirect>} />
                    <Route path="/seller/products" element={<SellerRedirect><SellerProducts /></SellerRedirect>} />
                    <Route path="/seller/orders" element={<SellerRedirect><SellerOrders /></SellerRedirect>} />
                    <Route path="/seller/analytics" element={<SellerRedirect><SellerAnalytics /></SellerRedirect>} />
                    <Route path="/seller/settings" element={<SellerRedirect><SellerSettings /></SellerRedirect>} />
                    
                    {/* Buyer Routes */}
                    <Route path="/shops" element={<BuyerRedirect><BrowseShops /></BuyerRedirect>} />
                    <Route path="/buyer/orders" element={<BuyerRedirect><BuyerOrders /></BuyerRedirect>} />
                    <Route path="/buyer/wishlist" element={<BuyerRedirect><BuyerWishlist /></BuyerRedirect>} />
                    <Route path="/buyer/notifications" element={<BuyerRedirect><Notifications /></BuyerRedirect>} />
                    <Route path="/buyer/addresses" element={<BuyerRedirect><Addresses /></BuyerRedirect>} />
                    <Route path="/buyer/payments" element={<BuyerRedirect><Payments /></BuyerRedirect>} />
                    
                    {/* Footer/Info Pages */}
                    <Route path="/help" element={<Help />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/cookies" element={<Privacy />} />
                    <Route path="/categories" element={<Browse />} />
                    <Route path="/deals" element={<Browse />} />
                    <Route path="/seller-resources" element={<About />} />
                    <Route path="/business-support" element={<Help />} />
                    <Route path="/partner-program" element={<About />} />
                    
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </ErrorBoundary>
              </BrowserRouter>
            </CartProvider>
            </AddressBookProvider>
            </WishlistProvider>
          </DeliveryModeProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
