"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { formatDate, isValidEmail, isValidPhone } from "@/lib/utils";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  Key, 
  Shield, 
  CreditCard,
  Package,
  Heart,
  Settings,
  Bell,
  CheckCircle2,
  Camera,
  Lock
} from "lucide-react";
import { LocationInput } from "@/components/LocationInput";
import { useAddressBook } from "@/context/AddressBookContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const { addresses, addAddress, removeAddress } = useAddressBook();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Name is required.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      toast({
        title: "Validation Error", 
        description: "Please enter a valid phone number.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await updateUser(formData);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
    setIsEditing(false);
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Password Reset Email Sent",
        description: "Please check your email for the password reset link.",
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Failed to Send Reset Email",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-accent/5">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Please log in to view your profile.</p>
              <Button onClick={() => navigate("/auth/login")}>Sign In</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">My Profile</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 shadow-lg border-primary/10">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto border-4 border-primary/20">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                      onClick={() => toast({ title: "Feature coming soon", description: "Profile picture upload will be available soon." })}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold">{user.name || 'User'}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  
                  <Badge variant="secondary" className="capitalize text-sm px-3 py-1">
                    {user.role}
                  </Badge>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {formatDate(user.createdAt)}</span>
                    </div>
                    
                    {user.isVerified && (
                      <div className="flex items-center gap-2 text-sm text-green-600 justify-center">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Verified Account</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                <TabsTrigger value="profile" className="text-xs sm:text-sm">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="addresses" className="text-xs sm:text-sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Addresses</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="text-xs sm:text-sm">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="text-xs sm:text-sm">
                  <Settings className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card className="shadow-lg border-primary/10">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Personal Information
                      </CardTitle>
                      
                      {!isEditing ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="touch-manipulation"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            disabled={loading}
                            className="touch-manipulation"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={loading}
                            className="touch-manipulation"
                          >
                            {loading ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                            ) : (
                              <Save className="w-4 h-4 mr-2" />
                            )}
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6 space-y-6">
                    {/* Name */}
                    <div>
                      <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="mt-2 h-11"
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="mt-2 p-3 bg-muted/50 rounded-lg border">
                          {user.name || 'Not provided'}
                        </div>
                      )}
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <div className="mt-2 p-3 bg-muted/30 rounded-lg border flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Email cannot be changed. Contact support if needed.
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="mt-2 h-11"
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <div className="mt-2 p-3 bg-muted/50 rounded-lg border flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{user.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <Label className="text-sm font-semibold flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address
                      </Label>
                      {isEditing ? (
                        <LocationInput
                          label=""
                          value={formData.address}
                          onChange={(value) => handleInputChange('address', value)}
                          placeholder="Enter your address"
                          className="mt-2"
                        />
                      ) : (
                        <div className="mt-2 p-3 bg-muted/50 rounded-lg border flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="break-words">{user.address || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses" className="space-y-6">
                <Card className="shadow-lg border-primary/10">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Saved Addresses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {addresses.length === 0 ? (
                      <div className="text-center py-8">
                        <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">No saved addresses yet.</p>
                        <Button onClick={() => navigate("/buyer/addresses")}>
                          Add Address
                        </Button>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {addresses.map(a => (
                          <Card key={a.id} className="border-2 hover:border-primary/50 transition-colors">
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-semibold mb-1">{a.label}</p>
                                  <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{a.line1}</p>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => removeAddress(a.id)}
                                  className="touch-manipulation"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 touch-manipulation"
                      onClick={() => navigate("/buyer/addresses")}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Manage Addresses
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card className="shadow-lg border-primary/10">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Lock className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">Password</p>
                            <p className="text-sm text-muted-foreground">Last updated 30 days ago</p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={handlePasswordReset}
                          disabled={loading}
                          className="touch-manipulation"
                        >
                          <Key className="w-4 h-4 mr-2" />
                          Change
                        </Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="p-4 rounded-lg border bg-muted/30">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <p className="font-semibold">Two-Factor Authentication</p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline" size="sm" disabled className="touch-manipulation">
                        Coming Soon
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences Tab */}
              <TabsContent value="preferences" className="space-y-6">
                <Card className="shadow-lg border-primary/10">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-auto p-4 justify-start touch-manipulation"
                        onClick={() => navigate("/buyer/orders")}
                      >
                        <Package className="h-5 w-5 mr-3 text-primary" />
                        <div className="text-left">
                          <p className="font-semibold">My Orders</p>
                          <p className="text-xs text-muted-foreground">View order history</p>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-auto p-4 justify-start touch-manipulation"
                        onClick={() => navigate("/buyer/wishlist")}
                      >
                        <Heart className="h-5 w-5 mr-3 text-primary" />
                        <div className="text-left">
                          <p className="font-semibold">Wishlist</p>
                          <p className="text-xs text-muted-foreground">Saved items</p>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-auto p-4 justify-start touch-manipulation"
                        onClick={() => navigate("/buyer/payments")}
                      >
                        <CreditCard className="h-5 w-5 mr-3 text-primary" />
                        <div className="text-left">
                          <p className="font-semibold">Payment Methods</p>
                          <p className="text-xs text-muted-foreground">Manage cards</p>
                        </div>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="h-auto p-4 justify-start touch-manipulation"
                        onClick={() => navigate("/buyer/notifications")}
                      >
                        <Bell className="h-5 w-5 mr-3 text-primary" />
                        <div className="text-left">
                          <p className="font-semibold">Notifications</p>
                          <p className="text-xs text-muted-foreground">Manage alerts</p>
                        </div>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
