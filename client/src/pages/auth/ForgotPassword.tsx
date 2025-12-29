"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, ArrowLeft, Store, CheckCircle2, KeyRound } from "lucide-react";
import authHeroImage from "@/assets/auth-hero.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast({
        title: "Email Sent!",
        description: "Check your email for the password reset link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset email. Please try again.",
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
                Reset your
                <span className="block bg-gradient-primary bg-clip-text text-transparent mt-2">
                  Password
                </span>
              </h2>
              <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center p-4 sm:p-8 lg:p-12">
          <div className="w-full max-w-md space-y-6 sm:space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-primary mb-4 shadow-lg">
                {emailSent ? (
                  <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                ) : (
                  <KeyRound className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                )}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {emailSent ? "Check Your Email" : "Forgot Password"}
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                {emailSent 
                  ? "We've sent a password reset link to your email address."
                  : "Enter your email to receive a password reset link."
                }
              </p>
            </div>

            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10 pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 sm:h-13 bg-background border-border focus:border-primary transition-all rounded-xl text-base touch-manipulation"
                      required
                      disabled={isLoading}
                    />
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
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Send Reset Link
                      <Mail className="h-5 w-5" />
                    </span>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-6 rounded-xl bg-primary/10 border border-primary/20 text-center">
                  <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    We've sent a password reset link to:
                  </p>
                  <p className="font-semibold break-all">{email}</p>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl border-2 hover:bg-primary/5 hover:border-primary transition-all touch-manipulation"
                  onClick={() => setEmailSent(false)}
                >
                  Use Different Email
                </Button>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="bg-background px-4 text-muted-foreground font-medium">
                  Remember your password?
                </span>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-primary hover:text-primary/80 transition-colors hover:underline touch-manipulation"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
