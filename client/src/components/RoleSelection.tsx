import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Store, Shield, ArrowRight } from "lucide-react";

const RoleSelection = () => {
  const roles = [
    {
      title: "I'm a Buyer",
      description: "Discover local shops and order fresh products from your neighborhood",
      icon: ShoppingCart,
      features: ["Browse local shops", "Quick delivery", "Rate & review", "WhatsApp support"],
      color: "primary",
      href: "/buyer-dashboard"
    },
    {
      title: "I'm a Seller",
      description: "Set up your shop and reach customers in your local area",
      icon: Store,
      features: ["Manage your shop", "WhatsApp marketing", "Order management", "Analytics"],
      color: "accent",
      href: "/seller-dashboard"
    },
    {
      title: "I'm an Admin",
      description: "Oversee the platform and manage users, shops, and orders",
      icon: Shield,
      features: ["User management", "Shop approval", "Monitor orders", "Platform analytics"],
      color: "secondary",
      href: "/admin-dashboard"
    }
  ];

  return (
    <section id="features" className="py-20 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Choose Your Role
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're shopping, selling, or managing the platform, 
            BuyNest has the perfect experience for you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <Card key={index} className="relative group hover:shadow-strong transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-${role.color}/10 flex items-center justify-center mb-4`}>
                    <Icon className={`w-8 h-8 text-${role.color}`} />
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                  <CardDescription className="text-center">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-2">
                    {role.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                        <ArrowRight className="w-4 h-4 mr-2 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={role.color === "primary" ? "hero" : role.color === "accent" ? "accent" : "default"}
                    className="w-full"
                    onClick={() => window.location.href = role.href}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default RoleSelection;