import { RefreshCw, AlertCircle, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type LocationDisplayProps = {
  status: "idle" | "loading" | "success" | "error";
  latitude: number | null;
  longitude: number | null;
  onRefresh: () => void;
};

export default function LocationDisplay({
  status,
  latitude,
  longitude,
  onRefresh,
}: LocationDisplayProps) {
  const formatLatitude = (lat: number | null) => {
    if (lat === null) return "Unknown";
    return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`;
  };

  const formatLongitude = (long: number | null) => {
    if (long === null) return "Unknown";
    return `${Math.abs(long).toFixed(4)}° ${long >= 0 ? "E" : "W"}`;
  };

  return (
    <Card className="bg-[#1C3359]/30 rounded-xl mb-6 backdrop-blur-md border-none">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-lg text-[#4DA8DA]">Your Location</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>

        {status === "idle" && (
          <div className="py-4 flex flex-col items-center justify-center">
            <p className="text-sm opacity-75 mb-3">
              Calculate how fast you're spinning on Earth based on your location.
            </p>
            <Button 
              onClick={onRefresh}
              className="bg-[#4DA8DA] hover:bg-[#4DA8DA]/80 text-white"
            >
              Calculate My Speed
            </Button>
          </div>
        )}

        {status === "loading" && (
          <div className="py-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4DA8DA]"></div>
            <span className="ml-3 text-sm opacity-75">Determining your location...</span>
          </div>
        )}

        {status === "error" && (
          <div className="py-4 text-[#E63946]">
            <div className="flex items-start">
              <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Location access denied</p>
                <p className="text-sm opacity-85">
                  Please enable location services to see your Earth rotation speed.
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-center">
              <Button 
                onClick={onRefresh}
                variant="outline"
                className="border-[#4DA8DA] text-[#4DA8DA] hover:bg-[#4DA8DA]/10"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="py-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <MapPin className="text-[#F2D399] mr-2 h-5 w-5" />
                <div>
                  <span className="text-sm opacity-75">Latitude</span>
                  <p className="text-xl font-medium">{formatLatitude(latitude)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Globe className="text-[#F2D399] mr-2 h-5 w-5" />
                <div>
                  <span className="text-sm opacity-75">Longitude</span>
                  <p className="text-xl font-medium">{formatLongitude(longitude)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
