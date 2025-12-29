"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Lock, KeyRound, Store, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import authHeroImage from "@/assets/auth-hero.jpg";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      toast({
        title: "Password Updated",
        description: "Your password has been successfully reset.",
      });
      
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
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
          
          <div className="relative z-10 flex flex-col justify-center p-8 lg:p-12 w-full">
            <div className="space-y-6 max-w-lg animate-fade-in">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-background/80 backdrop-blur-xl rounded-full border border-border/50 shadow-lg">
                <Store className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">BuyNest</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                Secure your
                <span className="block bg-gradient-primary bg-clip-text text-transparent mt-2">
                  Premium Account
                </span>
              </h2>
              <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
                Reset your password and regain access to your premium marketplace experience.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center p-4 sm:p-8 lg:p-12">
          <div className="w-full max-w-md space-y-6 sm:space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-primary mb-4 shadow-lg">
                {success ? (
                  <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                ) : (
                  <KeyRound className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                )}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {success ? "Password Reset!" : "Reset Password"}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                {success 
                  ? "Your password has been successfully reset. Redirecting to login..."
                  : "Enter your new password below"
                }
              </p>
            </div>

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold">New Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10 pointer-events-none" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 sm:h-13 bg-background border-border focus:border-primary transition-all rounded-xl text-base touch-manipulation"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors touch-manipulation"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10 pointer-events-none" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-12 pr-12 h-12 sm:h-13 bg-background border-border focus:border-primary transition-all rounded-xl text-base touch-manipulation"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors touch-manipulation"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 sm:h-13 text-base sm:text-lg font-bold bg-gradient-primary hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl rounded-xl touch-manipulation"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Resetting Password...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            ) : (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6 text-center">
                  <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">Password Reset Successful!</p>
                  <p className="text-sm text-muted-foreground">Redirecting to login page...</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
