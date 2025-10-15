"use client";
import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useSellerProducts } from "@/hooks/useSellerProducts";
import { useSellerShop } from "@/hooks/useSellerShop";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Package,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ProductManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [stockValue, setStockValue] = useState<number>(0);
  const { products, loading, error, deleteProduct, updateStock, toggleProductStatus } = useSellerProducts();
  const { shop, loading: shopLoading } = useSellerShop();
  const { toast } = useToast();

  const filteredProducts = useMemo(() => 
    products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    ), [products, searchQuery]
  );

  const handleDelete = useCallback(async (productId: string, productName: string) => {
    try {
      await deleteProduct(productId);
      toast({
        title: "Product deleted",
        description: `${productName} has been deleted successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  }, [deleteProduct, toast]);

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const handleStockUpdate = useCallback(async (productId: string) => {
    try {
      await updateStock(productId, stockValue);
      toast({
        title: "Stock updated",
        description: "Product stock has been updated successfully.",
      });
      setEditingStock(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      });
    }
  }, [updateStock, stockValue, toast]);

  const handleToggleActive = useCallback(async (productId: string, isActive: boolean) => {
    try {
      await toggleProductStatus(productId, isActive);
      toast({
        title: "Product status updated",
        description: `Product has been ${isActive ? 'activated' : 'deactivated'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product status. Please try again.",
        variant: "destructive",
      });
    }
  }, [toggleProductStatus, toast]);

  const startStockEdit = useCallback((productId: string, currentStock: number) => {
    setEditingStock(productId);
    setStockValue(currentStock);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your product inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your product inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if shop is approved
  if (shopLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your product inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading shop information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (shop && !shop.is_approved) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your product inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Shop Not Approved Yet</h3>
            <p className="text-muted-foreground mb-4">
              You cannot add or manage products until your shop is approved by our admin team.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-left">
              <p className="font-semibold mb-2 text-yellow-800">What you can do:</p>
              <ul className="space-y-1 text-yellow-700">
                <li>• Wait for admin approval of your shop</li>
                <li>• Edit your shop details if needed</li>
                <li>• Prepare your product information</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Manage your product inventory</CardDescription>
            </div>
            <Link to="/products/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Badge variant="outline" className="ml-auto">
              {filteredProducts.length} products
            </Badge>
          </div>

          {/* Products Table */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No products match your search." : "Start by adding your first product."}
              </p>
              <Link to="/products/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl || "/images/products/default-product.jpg"}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              SKU: {product.sku || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{formatPrice(product.price)}</div>
                          {product.originalPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.originalPrice)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {editingStock === product.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={stockValue}
                              onChange={(e) => setStockValue(Number(e.target.value))}
                              className="w-20 h-8"
                              min="0"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleStockUpdate(product.id)}
                              className="h-8 px-2"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingStock(null)}
                              className="h-8 px-2"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {product.stockQuantity || 0}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startStockEdit(product.id, product.stockQuantity || 0)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={product.isActive ?? true}
                          onCheckedChange={(checked) => handleToggleActive(product.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {product.isActive === false ? (
                            <>
                              <XCircle className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-600">Inactive</span>
                            </>
                          ) : product.inStock && (product.stockQuantity || 0) > 0 ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600">In Stock</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-red-600" />
                              <span className="text-sm text-red-600">Out of Stock</span>
                            </>
                          )}
                          {product.isFeatured && (
                            <Badge variant="default" className="text-xs">Featured</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(product.id, product.name)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;