"use client";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, ArrowLeft, Store, CheckCircle2 } from "lucide-react";
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

  if (emailSent) {
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
            
            <div className="relative z-10 flex flex-col justify-center p-12 w-full">
              <div className="space-y-6 max-w-lg animate-fade-in">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-background/80 backdrop-blur-xl rounded-full border border-border/50 shadow-elegant">
                  <Store className="h-5 w-5 text-primary" />
                  <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">BuyNest</span>
                </div>
                
                <h2 className="text-5xl font-bold leading-tight text-foreground">
                  Check your
                  <span className="block bg-gradient-primary bg-clip-text text-transparent mt-2">
                    Inbox
                  </span>
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We've sent you a secure link to reset your password and get you back to shopping.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Success Message */}
          <div className="flex items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-md space-y-8 animate-fade-in">
              <div className="text-center space-y-6">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary mb-4">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Check Your Email
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We've sent a password reset link to<br />
                  <strong className="text-foreground">{email}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => setEmailSent(false)}
                  variant="outline"
                  className="w-full h-12 rounded-xl border-2 hover:bg-primary/5 hover:border-primary transition-all"
                >
                  Didn't receive email? Try again
                </Button>

                <Link to="/auth/login">
                  <Button variant="ghost" className="w-full group rounded-xl">
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          
          <div className="relative z-10 flex flex-col justify-center p-12 w-full">
            <div className="space-y-6 max-w-lg animate-fade-in">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-background/80 backdrop-blur-xl rounded-full border border-border/50 shadow-elegant">
                <Store className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">BuyNest</span>
              </div>
              
              <h2 className="text-5xl font-bold leading-tight text-foreground">
                Recover your
                <span className="block bg-gradient-primary bg-clip-text text-transparent mt-2">
                  Account
                </span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We'll help you recover your account quickly and securely so you can get back to shopping.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Forgot Password?
              </h2>
              <p className="text-muted-foreground text-lg">
                No worries! Enter your email and we'll send you reset instructions
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 bg-background border-border focus:border-primary transition-all rounded-xl relative z-0"
                    required
                    autoComplete="email"
                  />
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
                    Sending Reset Link...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
            
            <Link to="/auth/login">
              <Button variant="ghost" className="w-full group rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;