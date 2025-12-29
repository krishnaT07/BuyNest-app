"use client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";
import { User, Mail, Phone, Lock, CheckCircle2, UserPlus, ShieldCheck, Truck, Store, Eye, EyeOff } from "lucide-react";
import authHeroImage from "@/assets/auth-hero.jpg";

type Step = "register" | "verify";

const Register = () => {
  const [step, setStep] = useState<Step>("register");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "" as UserRole,
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.includes("@")) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.role) {
      toast({
        title: "Validation Error",
        description: "Please select your role.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await register(formData);
      
      toast({
        title: "Account Created!",
        description: "Please check your email for the verification code.",
      });
      
      setStep("verify");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: otp,
        type: 'signup',
      });

      if (error) throw error;

      toast({
        title: "Email Verified!",
        description: "Your account has been verified. You can now sign in.",
      });
      
      navigate("/auth/login");
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Please check your code and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
      });

      if (error) throw error;

      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error: any) {
      toast({
        title: "Resend Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "verify") {
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
                  Almost there!
                  <span className="block bg-gradient-primary bg-clip-text text-transparent mt-2">
                    Verify Your Email
                  </span>
                </h2>
                <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
                  Check your inbox and enter the verification code to complete your registration.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Verification Form */}
          <div className="flex items-center justify-center p-4 sm:p-8 lg:p-12">
            <div className="w-full max-w-md space-y-6 sm:space-y-8 animate-fade-in">
              <div className="text-center space-y-3">
                <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-primary mb-4 shadow-lg">
                  <Mail className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Verify Your Email
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                  We've sent a 6-digit code to<br /><strong className="text-foreground break-all">{formData.email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6 sm:space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="otp" className="text-center block text-sm font-semibold">
                    Enter Verification Code
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup className="gap-2 sm:gap-3">
                        <InputOTPSlot index={0} className="w-10 h-12 sm:w-12 sm:h-14 text-base sm:text-lg border-2 rounded-xl transition-all duration-200 hover:border-primary touch-manipulation" />
                        <InputOTPSlot index={1} className="w-10 h-12 sm:w-12 sm:h-14 text-base sm:text-lg border-2 rounded-xl transition-all duration-200 hover:border-primary touch-manipulation" />
                        <InputOTPSlot index={2} className="w-10 h-12 sm:w-12 sm:h-14 text-base sm:text-lg border-2 rounded-xl transition-all duration-200 hover:border-primary touch-manipulation" />
                        <InputOTPSlot index={3} className="w-10 h-12 sm:w-12 sm:h-14 text-base sm:text-lg border-2 rounded-xl transition-all duration-200 hover:border-primary touch-manipulation" />
                        <InputOTPSlot index={4} className="w-10 h-12 sm:w-12 sm:h-14 text-base sm:text-lg border-2 rounded-xl transition-all duration-200 hover:border-primary touch-manipulation" />
                        <InputOTPSlot index={5} className="w-10 h-12 sm:w-12 sm:h-14 text-base sm:text-lg border-2 rounded-xl transition-all duration-200 hover:border-primary touch-manipulation" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 sm:h-13 text-base font-bold bg-gradient-primary hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl rounded-xl touch-manipulation"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Verify Email
                    </span>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 rounded-xl border-2 hover:bg-primary/5 hover:border-primary transition-all touch-manipulation"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                >
                  Resend Code
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          
          <div className="relative z-10 flex flex-col justify-between p-8 lg:p-12 w-full">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-background/80 backdrop-blur-xl rounded-full border border-border/50 shadow-lg">
                <Store className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">BuyNest</span>
              </div>
              
              <div className="space-y-6 max-w-lg animate-fade-in">
                <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-foreground">
                  Join thousands of
                  <span className="block bg-gradient-primary bg-clip-text text-transparent mt-2">
                    Premium Shoppers
                  </span>
                </h2>
                <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
                  Start your journey with exceptional local businesses and discover premium products.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-2xl">
              <div className="group p-4 lg:p-6 bg-background/60 backdrop-blur-xl rounded-2xl border border-border/50 hover:bg-background/80 hover:shadow-lg transition-all touch-manipulation">
                <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-3 lg:mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                <p className="font-bold text-lg lg:text-xl text-foreground mb-1">Secure</p>
                <p className="text-xs lg:text-sm text-muted-foreground">Encrypted Data</p>
              </div>
              
              <div className="group p-4 lg:p-6 bg-background/60 backdrop-blur-xl rounded-2xl border border-border/50 hover:bg-background/80 hover:shadow-lg transition-all touch-manipulation">
                <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-3 lg:mb-4 group-hover:scale-110 transition-transform">
                  <Truck className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                <p className="font-bold text-lg lg:text-xl text-foreground mb-1">Fast</p>
                <p className="text-xs lg:text-sm text-muted-foreground">Quick Delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
          <div className="w-full max-w-md space-y-6 sm:space-y-8 py-4 sm:py-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-primary mb-4 shadow-lg">
                <UserPlus className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
                Join BuyNest and start shopping
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10 pointer-events-none" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="pl-12 h-12 bg-background border-border focus:border-primary transition-all rounded-xl text-base touch-manipulation"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10 pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-12 h-12 bg-background border-border focus:border-primary transition-all rounded-xl text-base touch-manipulation"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10 pointer-events-none" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="pl-12 h-12 bg-background border-border focus:border-primary transition-all rounded-xl text-base touch-manipulation"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-semibold">I want to</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value as UserRole })
                  }
                >
                  <SelectTrigger id="role" className="h-12 bg-background border-border focus:border-primary transition-all rounded-xl text-base touch-manipulation">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Shop as a Buyer</SelectItem>
                    <SelectItem value="seller">Sell as a Seller</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10 pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-12 pr-12 h-12 bg-background border-border focus:border-primary transition-all rounded-xl text-base touch-manipulation"
                    required
                    minLength={6}
                    autoComplete="new-password"
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
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="pl-12 pr-12 h-12 bg-background border-border focus:border-primary transition-all rounded-xl text-base touch-manipulation"
                    required
                    minLength={6}
                    autoComplete="new-password"
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
                className="w-full h-12 sm:h-13 text-base font-bold bg-gradient-primary hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl rounded-xl touch-manipulation"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="text-center p-4 rounded-xl bg-muted/50 border border-border/50">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/auth/login" className="font-bold text-primary hover:text-primary/80 transition-colors hover:underline touch-manipulation">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
