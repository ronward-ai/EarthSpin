import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Globe, Share, Check, MapPin, RefreshCw, AlertCircle } from "lucide-react";
import { calculateRotationSpeed } from "@/lib/calculations";
import { formatNumber } from "@/lib/units";
import { useToast } from "@/hooks/use-toast";

type UnitType = "kph" | "mph" | "mps";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [unit, setUnit] = useState<UnitType>("kph");
  const [copied, setCopied] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const { toast } = useToast();

  const speeds = latitude !== null 
    ? calculateRotationSpeed(latitude)
    : { kph: 0, mph: 0, mps: 0 };

  const formatLatitude = (lat: number | null) => {
    if (lat === null) return "Unknown";
    return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`;
  };

  const formatLongitude = (lng: number | null) => {
    if (lng === null) return "Unknown";
    return `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
  };

  const getCurrentSpeed = () => {
    if (unit === "kph") return speeds.kph;
    if (unit === "mph") return speeds.mph;
    return speeds.mps;
  };

  const getUnitLabel = () => {
    if (unit === "kph") return "km/h";
    if (unit === "mph") return "mph";
    return "m/s";
  };

  function handleCalculate() {
    console.log("Button clicked");
    setIsLoading(true);
    setHasError(false);

    if (!navigator.geolocation) {
      setHasError(true);
      setIsLoading(false);
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Got position:", position.coords.latitude);
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setIsLoading(false);
      },
      (error) => {
        console.error("Location error:", error);
        setHasError(true);
        setIsLoading(false);
        toast({
          title: "Location Error",
          description: "Could not get your location. Please try again.",
          variant: "destructive"
        });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleShare() {
    if (!latitude) return;

    const shareText = `I'm spinning at ${formatNumber(getCurrentSpeed())} ${getUnitLabel()}. Check your own Earth rotation speed at ${window.location.origin}`;

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
    <div className="flex flex-col min-h-screen text-white starry-sky">
      <header className="py-4 px-6 bg-[#0a0e1f]/30 backdrop-blur-sm border-b border-white/5">
        <div className="container mx-auto">
          <h1 className="text-xl md:text-2xl font-bold flex items-center justify-center">
            <Globe className="mr-2 text-[#4DA8DA]" />
            <span className="bg-gradient-to-r from-blue-300 to-[#4DA8DA] text-transparent bg-clip-text">
              EarthSpin
            </span>
          </h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col">
        <Card className="bg-[#0a0e1f]/40 rounded-xl mb-6 backdrop-blur-md border border-white/10 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-lg text-[#4DA8DA]">Your Location</h2>
              {latitude !== null && !isLoading && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCalculate}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  <RefreshCw className="h-5 w-5" />
                </Button>
              )}
            </div>

            {latitude === null && !isLoading && !hasError && (
              <div className="py-4 flex flex-col items-center justify-center">
                <p className="text-sm opacity-75 mb-3">
                  Calculate how fast you're spinning on Earth based on your location.
                </p>
                <Button 
                  onClick={handleCalculate}
                  className="bg-gradient-to-r from-[#4DA8DA] to-[#2A7DA8] hover:from-[#3A97C9] hover:to-[#1A6C97] text-white px-6 py-5 h-auto border border-blue-400/30 shadow-lg shadow-blue-500/20"
                  size="lg"
                >
                  Calculate My Speed
                </Button>
              </div>
            )}

            {isLoading && (
              <div className="py-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4DA8DA]"></div>
                <span className="ml-3 text-sm opacity-75">Determining your location...</span>
              </div>
            )}

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
                    onClick={handleCalculate}
                    className="bg-gradient-to-r from-[#4DA8DA] to-[#2A7DA8] hover:from-[#3A97C9] hover:to-[#1A6C97] text-white border border-blue-400/30 shadow-lg shadow-blue-500/20"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}

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

        <div className="flex-grow flex flex-col items-center justify-center my-4 md:my-8 relative">
          <div className="absolute w-52 h-52 md:w-72 md:h-72 bg-[#4DA8DA] opacity-5 rounded-full"></div>

          <div className="relative mb-8 h-40 w-40 md:h-52 md:w-52 flex items-center justify-center">
            <div className="absolute w-full h-full rounded-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-b from-[#1C3359] to-[#0A1128] shadow-lg"></div>
            </div>

            <div className="absolute w-full h-0.5 bg-[#F2D399]/70 shadow-lg shadow-[#F2D399]/30"></div>

            {latitude !== null && (
              <div 
                className="absolute w-5 h-5 flex items-center justify-center"
                style={{ 
                  right: `30%`,
                  top: `${((90 - latitude) / 180) * 100}%`,
                  transform: 'translate(50%, -50%)'
                }}
              >
                <span className="w-5 h-5 bg-[#F2D399]/30 rounded-full animate-ping absolute"></span>
                <span className="w-3 h-3 bg-[#F2D399] rounded-full shadow-lg shadow-[#F2D399]/50 relative"></span>
              </div>
            )}
          </div>

          {latitude === null ? (
            <div className="text-center mb-6 opacity-70">
              <h2 className="font-medium text-xl md:text-2xl mb-2 text-[#F2D399]">Discover Your Rotation Speed</h2>
              <p className="max-w-md mx-auto text-sm">
                Click the Calculate button above to find out how fast you're spinning on Earth right now.
              </p>
            </div>
          ) : (
            <div className="text-center mb-6">
              <h2 className="font-medium text-xl md:text-2xl mb-2 text-[#F2D399]">You are spinning at</h2>

              <div className="text-5xl md:text-7xl font-bold my-4">
                {formatNumber(getCurrentSpeed())}
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
          )}
        </div>

        {latitude !== null && (
          <>
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
          </>
        )}
      </main>

      <footer className="py-4 px-6 bg-[#0a0e1f]/30 backdrop-blur-sm border-t border-white/5">
        <div className="container mx-auto text-sm text-center text-white/70">
          <p className="text-[#4DA8DA]/90">
            © 2025 EarthSpin is a project by Artist{" "}
            <button
              onClick={() => setShowEmail(!showEmail)}
              className="text-[#F2D399] hover:text-[#F2D399]/80 transition-colors underline cursor-pointer bg-transparent border-none p-0 font-inherit"
            >
              Ron Ward
            </button>
            {showEmail && (
              <span className="block mt-1 text-[#F2D399]/80 text-xs">
                ronward.creates@gmail.com
              </span>
            )}
          </p>
        </div>
      </footer>
    </div>
  );
}