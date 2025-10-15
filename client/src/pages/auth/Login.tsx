"use client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, ShoppingBag, Store, ArrowRight } from "lucide-react";
import authHeroImage from "@/assets/auth-hero.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      // Don't navigate here - let the auth context handle role-based redirect
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left side - Premium Hero Image */}
        <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] z-0" />
          <img 
            src={authHeroImage} 
            alt="BuyNest Premium Shopping" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent z-[1]" />
          
          <div className="relative z-10 flex flex-col justify-between p-12 w-full">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-background/80 backdrop-blur-xl rounded-full border border-border/50 shadow-elegant">
                <Store className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">BuyNest</span>
              </div>
              
              <div className="space-y-6 max-w-lg animate-fade-in">
                <h2 className="text-5xl font-bold leading-tight text-foreground">
                  Welcome back to your
                  <span className="block bg-gradient-primary bg-clip-text text-transparent mt-2">
                    Premium Marketplace
                  </span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Connect with premium local businesses and discover exceptional products in your neighborhood.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-2xl">
              <div className="group p-6 bg-background/60 backdrop-blur-xl rounded-2xl border border-border/50 hover:bg-background/80 hover:shadow-soft transition-all">
                <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="h-7 w-7 text-white" />
                </div>
                <p className="font-bold text-xl text-foreground mb-1">10,000+</p>
                <p className="text-sm text-muted-foreground">Premium Products</p>
              </div>
              
              <div className="group p-6 bg-background/60 backdrop-blur-xl rounded-2xl border border-border/50 hover:bg-background/80 hover:shadow-soft transition-all">
                <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Store className="h-7 w-7 text-white" />
                </div>
                <p className="font-bold text-xl text-foreground mb-1">500+</p>
                <p className="text-sm text-muted-foreground">Local Shops</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Premium Login Form */}
        <div className="flex items-center justify-center p-8 lg:p-12 bg-background">
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-muted-foreground text-lg">Sign in to access your premium marketplace</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Email address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10 pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="pl-12 h-12 bg-background border-border focus:border-primary transition-all rounded-xl relative z-0"
                      placeholder="you@example.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-semibold">
                      Password
                    </Label>
                    <Link
                      to="/auth/forgot-password"
                      className="text-sm text-primary hover:text-primary/80 font-semibold transition-colors hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10 pointer-events-none" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="pl-12 h-12 bg-background border-border focus:border-primary transition-all rounded-xl relative z-0"
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-13 text-base font-bold bg-gradient-primary hover:opacity-90 hover:scale-[1.02] transition-all shadow-elegant hover:shadow-glow rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign in
                    <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-muted-foreground font-medium">
                  New to BuyNest?
                </span>
              </div>
            </div>

            <div className="text-center p-4 rounded-xl bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/auth/register"
                  className="font-bold text-primary hover:text-primary/80 transition-colors hover:underline"
                >
                  Create your account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;