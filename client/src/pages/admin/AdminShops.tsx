"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePendingShops } from "@/hooks/usePendingShops";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Store, Search, CheckCircle, XCircle, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

const AdminShops = () => {
  const { pendingShops, loading, approveShop, rejectShop, refetch } = usePendingShops();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [allShops, setAllShops] = useState<any[]>([]);
  const [loadingAll, setLoadingAll] = useState(true);

  // Fetch all shops
  useEffect(() => {
    const fetchAllShops = async () => {
      try {
        const { data, error } = await supabase
          .from('shops')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAllShops(data || []);
      } catch (error) {
        console.error('Error fetching shops:', error);
      } finally {
        setLoadingAll(false);
      }
    };
    fetchAllShops();
  }, []);

  const handleApprove = async (shopId: string) => {
    try {
      await approveShop(shopId);
      toast({
        title: "Shop approved!",
        description: "The shop has been approved and can now start selling.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve shop. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (shopId: string) => {
    try {
      await rejectShop(shopId);
      toast({
        title: "Shop rejected",
        description: "The shop has been rejected and removed.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject shop. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredShops = allShops.filter(shop =>
    shop.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Shops</h1>
          <p className="text-muted-foreground">Manage all shops on the platform</p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Pending Shops */}
        {pendingShops.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Pending Approval ({pendingShops.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shop Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingShops.map((shop) => (
                    <TableRow key={shop.id}>
                      <TableCell className="font-medium">{shop.name}</TableCell>
                      <TableCell>{shop.owner_name || "N/A"}</TableCell>
                      <TableCell>{shop.address}</TableCell>
                      <TableCell>{formatDate(shop.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(shop.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(shop.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* All Shops */}
        {loadingAll ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading shops...</p>
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-12">
            <Store className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No shops found</h3>
            <p className="text-muted-foreground">Try adjusting your search query</p>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Shops ({filteredShops.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Shop Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShops.map((shop) => (
                    <TableRow key={shop.id}>
                      <TableCell className="font-medium">{shop.name}</TableCell>
                      <TableCell>{shop.address}</TableCell>
                      <TableCell>
                        <Badge variant={shop.is_approved ? "default" : "secondary"}>
                          {shop.is_approved ? "Approved" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(shop.created_at)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminShops;

