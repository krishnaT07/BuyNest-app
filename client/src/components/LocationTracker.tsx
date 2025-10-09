"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock } from "lucide-react";
import { useDeliveryMode } from "@/context/DeliveryModeContext";

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  estimatedTime: string;
}

interface LocationTrackerProps {
  orderId: string;
  shopName: string;
  shopAddress?: string;
}

const LocationTracker = ({ orderId, shopName, shopAddress }: LocationTrackerProps) => {
  const { deliveryMode } = useDeliveryMode();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // Mock location data - in real app, this would come from GPS/API
  useEffect(() => {
    setIsTracking(true);
    
    // Simulate real-time location updates
    const interval = setInterval(() => {
      if (deliveryMode === "pickup") {
        // Static shop location for pickup
        setLocation({
          latitude: 28.6139 + Math.random() * 0.001,
          longitude: 77.2090 + Math.random() * 0.001,
          address: shopAddress || "Shop Location",
          estimatedTime: "Ready for pickup"
        });
      } else {
        // Moving rider location for delivery
        setLocation({
          latitude: 28.6139 + Math.random() * 0.01,
          longitude: 77.2090 + Math.random() * 0.01,
          address: `Delivery in progress`,
          estimatedTime: `${Math.floor(Math.random() * 20 + 10)} min away`
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [deliveryMode, shopAddress]);

  if (!isTracking || !location) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Navigation className="h-8 w-8 mx-auto mb-2 animate-spin text-primary" />
            <p>Connecting to tracking...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {deliveryMode === "pickup" ? "Shop Location" : "Delivery Tracking"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant={deliveryMode === "pickup" ? "secondary" : "default"}>
            {deliveryMode === "pickup" ? "Pickup Mode" : "Delivery Mode"}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {location.estimatedTime}
          </Badge>
        </div>

        <div>
          <h3 className="font-semibold mb-1">{shopName}</h3>
          <p className="text-sm text-muted-foreground">{location.address}</p>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <span>Coordinates:</span>
            <span className="font-mono">
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </span>
          </div>
        </div>

        {deliveryMode === "pickup" ? (
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-green-700 dark:text-green-300 font-medium">
              Your order is ready for pickup!
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Visit the shop at the location above
            </p>
          </div>
        ) : (
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-blue-700 dark:text-blue-300 font-medium">
              Rider is on the way!
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Track real-time location above
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationTracker;