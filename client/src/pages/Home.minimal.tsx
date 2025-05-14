import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Globe, Share, Check, MapPin, RefreshCw, AlertCircle } from "lucide-react";
import { calculateRotationSpeed } from "@/lib/calculations";
import { formatNumber, getUnitName } from "@/lib/units";
import { useToast } from "@/hooks/use-toast";
import EducationalContent from "@/components/EducationalContent";

type UnitType = "kph" | "mph" | "mps";

export default function Home() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [unit, setUnit] = useState<UnitType>("kph");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const { toast } = useToast();
  
  // Calculate speeds based on latitude
  const speeds = latitude !== null 
    ? calculateRotationSpeed(latitude)
    : { kph: 0, mph: 0, mps: 0 };
  
  // Format latitude display
  const formatLatitude = (lat: number | null) => {
    if (lat === null) return "Unknown";
    return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`;
  };
  
  // Format longitude display
  const formatLongitude = (lng: number | null) => {
    if (lng === null) return "Unknown";
    return `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
  };
  
  // Get current speed in the selected unit
  const getCurrentSpeed = () => {
    if (unit === "kph") return speeds.kph;
    if (unit === "mph") return speeds.mph;
    return speeds.mps;
  };
  
  // Get unit label
  const getUnitLabel = () => {
    if (unit === "kph") return "km/h";
    if (unit === "mph") return "mph";
    return "m/s";
  };
  
  function handleCalculateClick() {
    console.log("Button clicked");
    setIsLoading(true);
    setHasError(false);
    
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      setHasError(true);
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Got position:", position.coords.latitude);
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        
        // Save location
        saveLocation(position.coords.latitude, position.coords.longitude);
        
        setIsLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Location Access Denied",
          description: "Please enable location services to see your Earth rotation speed.",
          variant: "destructive"
        });
        setHasError(true);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }
  
  // Save location to database
  function saveLocation(lat: number, lng: number) {
    fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitude: lat,
        longitude: lng,
        rotationSpeedKph: speeds.kph
      })
    }).catch(console.error);
  }
  
  // Handle share button click
  function handleShare() {
    if (!latitude) return;
    
    const shareText = `I'm spinning at ${formatNumber(getCurrentSpeed())} ${getUnitLabel()} due to Earth's rotation! Check your own speed at ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: "EarthSpin - Earth's Rotation Speed",
        text: shareText,
        url: window.location.href
      }).catch(() => {
        handleCopy(shareText);
      });
    } else {
      handleCopy(shareText);
    }
  }
  
  // Copy to clipboard fallback
  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Share text copied!"
    });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col min-h-screen text-white relative" style={{ 
      background: 'linear-gradient(to bottom, #0a0e1f 0%, #0e1d3b 100%)'
    }}>
      {/* Stars background - direct implementation */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 25% 15%, white, transparent),
            radial-gradient(1px 1px at 50% 40%, white, transparent),
            radial-gradient(1px 1px at 75% 25%, white, transparent),
            radial-gradient(1.5px 1.5px at 10% 60%, white, transparent),
            radial-gradient(1.5px 1.5px at 30% 85%, white, transparent),
            radial-gradient(1.5px 1.5px at 65% 70%, white, transparent),
            radial-gradient(1px 1px at 85% 45%, white, transparent),
            radial-gradient(1.5px 1.5px at 95% 90%, white, transparent)
          `,
          opacity: 0.8
        }}
      />
      
      {/* Twinkling stars - direct implementation */}
      <div 
        className="fixed inset-0 pointer-events-none animate-twinkle"
        style={{
          backgroundImage: `
            radial-gradient(2px 2px at 30% 20%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(2px 2px at 60% 35%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(2px 2px at 40% 80%, rgba(255, 255, 255, 0.9), transparent),
            radial-gradient(2px 2px at 80% 10%, rgba(255, 255, 255, 0.9), transparent)
          `,
          opacity: 0
        }}
      />

      <header className="p-4 bg-[#0a0e1f]/60 backdrop-blur-sm border-b border-white/10 relative z-10">
        <h1 className="text-2xl font-bold text-center flex items-center justify-center">
          <Globe className="mr-2 text-blue-400" />
          <span className="bg-gradient-to-r from-blue-300 to-blue-500 text-transparent bg-clip-text">
            EarthSpin
          </span>
        </h1>
      </header>

      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center relative z-10">
        {/* Location Card */}
        <Card className="bg-[#0a0e1f]/40 backdrop-blur-md border border-white/10 shadow-xl w-full max-w-md mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-medium text-lg text-[#4DA8DA]">Your Location</h2>
              {latitude !== null && !isLoading && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCalculateClick}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <RefreshCw className="h-5 w-5" />
                </Button>
              )}
            </div>
            
            {/* Initial state */}
            {latitude === null && !isLoading && !hasError && (
              <div className="py-4 flex flex-col items-center justify-center">
                <p className="text-sm opacity-75 mb-3 text-center">
                  Calculate how fast you're spinning on Earth based on your location.
                </p>
                <Button 
                  onClick={handleCalculateClick}
                  className="bg-gradient-to-r from-[#4DA8DA] to-[#2A7DA8] hover:from-[#3A97C9] hover:to-[#1A6C97] text-white px-6 py-5 h-auto border border-blue-400/30 shadow-lg shadow-blue-500/20"
                  size="lg"
                >
                  Calculate My Speed
                </Button>
              </div>
            )}
            
            {/* Loading state */}
            {isLoading && (
              <div className="py-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4DA8DA]"></div>
                <span className="ml-3 text-sm opacity-75">Determining your location...</span>
              </div>
            )}
            
            {/* Error state */}
            {hasError && !isLoading && (
              <div className="py-4">
                <div className="flex items-start">
                  <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0 text-[#E63946]" />
                  <div>
                    <p className="font-medium text-[#E63946]">Location access denied</p>
                    <p className="text-sm opacity-85">
                      Please enable location services to see your Earth rotation speed.
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex justify-center">
                  <Button 
                    onClick={handleCalculateClick}
                    className="bg-gradient-to-r from-[#4DA8DA] to-[#2A7DA8] hover:from-[#3A97C9] hover:to-[#1A6C97] text-white border border-blue-400/30 shadow-lg shadow-blue-500/20"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
            
            {/* Success state */}
            {latitude !== null && !isLoading && (
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
        
        {/* Earth Visualization and Speed */}
        {latitude !== null && !isLoading && (
          <div className="w-full max-w-md mb-8">
            {/* Earth visualization */}
            <div className="relative mb-8 mt-2 h-40 w-40 mx-auto flex items-center justify-center">
              {/* Earth sphere */}
              <div className="absolute w-full h-full rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-b from-[#1C3359] to-[#0A1128] shadow-lg"></div>
              </div>
              
              {/* Equator line */}
              <div className="absolute w-full h-0.5 bg-[#F2D399]/70 shadow-lg shadow-[#F2D399]/30"></div>
              
              {/* Position marker */}
              <div 
                className="absolute flex items-center justify-center"
                style={{ 
                  right: '50%',
                  top: `${((90 - latitude) / 180) * 100}%`,
                  transform: 'translate(50%, -50%)'
                }}
              >
                <span className="w-5 h-5 bg-[#F2D399]/30 rounded-full animate-ping absolute"></span>
                <span className="w-3 h-3 bg-[#F2D399] rounded-full shadow-lg shadow-[#F2D399]/50 relative"></span>
              </div>
            </div>
            
            {/* Speed display */}
            <div className="text-center mb-6">
              <h2 className="font-medium text-xl md:text-2xl mb-2 text-[#F2D399]">You are spinning at</h2>
              
              <div className="text-5xl md:text-6xl font-bold my-4 bg-gradient-to-r from-blue-300 to-blue-500 text-transparent bg-clip-text">
                {formatNumber(getCurrentSpeed())} {getUnitLabel()}
              </div>
              
              <div className="inline-flex bg-[#1C3359]/30 backdrop-blur-sm rounded-full p-1 mb-4">
                <Button
                  variant={unit === "kph" ? "default" : "ghost"}
                  className={`px-4 py-2 rounded-full ${
                    unit === "kph" 
                      ? "bg-[#4DA8DA]/80 text-white" 
                      : "text-white/70 hover:text-white"
                  }`}
                  onClick={() => setUnit("kph")}
                >
                  km/h
                </Button>
                <Button
                  variant={unit === "mph" ? "default" : "ghost"}
                  className={`px-4 py-2 rounded-full ${
                    unit === "mph" 
                      ? "bg-[#4DA8DA]/80 text-white" 
                      : "text-white/70 hover:text-white"
                  }`}
                  onClick={() => setUnit("mph")}
                >
                  mph
                </Button>
                <Button
                  variant={unit === "mps" ? "default" : "ghost"}
                  className={`px-4 py-2 rounded-full ${
                    unit === "mps" 
                      ? "bg-[#4DA8DA]/80 text-white" 
                      : "text-white/70 hover:text-white"
                  }`}
                  onClick={() => setUnit("mps")}
                >
                  m/s
                </Button>
              </div>
            </div>
            
            {/* Share Button */}
            <Separator className="my-6 bg-white/20" />
            
            <div className="mt-2 mb-6 flex flex-col items-center">
              <Button 
                onClick={handleShare} 
                className="bg-gradient-to-r from-[#4DA8DA] to-[#2A7DA8] hover:from-[#3A97C9] hover:to-[#1A6C97] px-6 py-5 text-lg h-auto border border-blue-400/30 shadow-lg shadow-blue-500/20"
                size="lg"
              >
                {copied ? <Check className="h-5 w-5 mr-2" /> : <Share className="h-5 w-5 mr-2" />}
                {copied ? "Copied!" : "Share Your Rotation Speed"}
              </Button>
            </div>
          </div>
        )}
        
        {/* Educational Content */}
        {latitude !== null && !isLoading && (
          <EducationalContent speeds={speeds} />
        )}
      </main>

      <footer className="p-4 bg-[#0a0e1f]/60 backdrop-blur-sm border-t border-white/10 relative z-10">
        <p className="text-center text-sm text-blue-200">EarthSpin - Experience Earth's rotation based on a radius of 6,371 km and 24-hour period</p>
      </footer>
    </div>
  );
}