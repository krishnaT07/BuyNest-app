"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  type: "card" | "upi" | "wallet";
  name: string;
  last4?: string;
  expiry?: string;
  upiId?: string;
  isDefault: boolean;
}

const Payments = () => {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      name: "Visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true
    },
    {
      id: "2",
      type: "upi",
      name: "UPI",
      upiId: "user@paytm",
      isDefault: false
    }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "card" as "card" | "upi" | "wallet",
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
    upiId: ""
  });

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: formData.type,
      name: formData.type === "card" ? formData.name : "UPI",
      last4: formData.type === "card" ? formData.cardNumber.slice(-4) : undefined,
      expiry: formData.type === "card" ? formData.expiry : undefined,
      upiId: formData.type === "upi" ? formData.upiId : undefined,
      isDefault: paymentMethods.length === 0
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    toast({ title: "Payment method added", description: "Your payment method has been added successfully." });
    setIsDialogOpen(false);
    setFormData({
      type: "card",
      cardNumber: "",
      expiry: "",
      cvv: "",
      name: "",
      upiId: ""
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
      toast({ title: "Payment method deleted", description: "Payment method has been removed." });
    }
  };

  const setDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
    toast({ title: "Default payment method updated" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Payment Methods</h1>
            <p className="text-muted-foreground">Manage your payment methods</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddPayment} className="space-y-4">
                <div>
                  <Label>Payment Type</Label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="upi">UPI</option>
                    <option value="wallet">Wallet</option>
                  </select>
                </div>
                {formData.type === "card" && (
                  <>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          value={formData.expiry}
                          onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="password"
                          value={formData.cvv}
                          onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="name">Cardholder Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                  </>
                )}
                {formData.type === "upi" && (
                  <div>
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      value={formData.upiId}
                      onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                      placeholder="yourname@paytm"
                    />
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Payment Method</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {paymentMethods.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No payment methods</h3>
            <p className="text-muted-foreground mb-4">Add a payment method to get started</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      {method.name}
                    </CardTitle>
                    {method.isDefault && (
                      <Badge variant="default">
                        <Check className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {method.type === "card" && (
                      <>
                        <p className="text-sm text-muted-foreground">
                          **** **** **** {method.last4}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Expires: {method.expiry}
                        </p>
                      </>
                    )}
                    {method.type === "upi" && (
                      <p className="text-sm text-muted-foreground">
                        {method.upiId}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDefault(method.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(method.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Payments;

