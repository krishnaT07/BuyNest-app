"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  helperText?: string;
}

export const LocationInput = ({
  label,
  value,
  onChange,
  placeholder = "Enter address or use current location",
  disabled = false,
  required = false,
  rows = 2,
  helperText
}: LocationInputProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding API (OpenStreetMap Nominatim - free, no key required)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          
          if (!response.ok) throw new Error("Failed to fetch address");
          
          const data = await response.json();
          const address = data.display_name || `${latitude}, ${longitude}`;
          
          onChange(address);
          
          toast({
            title: "Location detected",
            description: "Your current location has been added",
          });
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          toast({
            title: "Could not get address",
            description: "Using coordinates instead",
            variant: "destructive",
          });
          
          // Fallback to coordinates
          onChange(`${position.coords.latitude}, ${position.coords.longitude}`);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLoading(false);
        
        let errorMessage = "Could not get your location";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location access denied. Please enable location permissions.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Location information unavailable";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Location request timed out";
        }
        
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={label} className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleGetCurrentLocation}
          disabled={loading || disabled}
          className="h-8 text-xs"
        >
          {loading ? (
            <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
          ) : (
            <Navigation className="h-3 w-3 mr-2" />
          )}
          Use Current Location
        </Button>
      </div>
      
      <Textarea
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        className="resize-none"
      />
      
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};
