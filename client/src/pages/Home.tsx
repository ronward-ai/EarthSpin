import { useState, useEffect } from "react";
import LocationDisplay from "@/components/LocationDisplay";
import RotationSpeedDisplay from "@/components/RotationSpeedDisplay";
import EducationalContent from "@/components/EducationalContent";
import ShareableCard from "@/components/ShareableCard";
import { calculateRotationSpeed } from "@/lib/calculations";
import { Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

type LocationState = "idle" | "loading" | "success" | "error";
type UnitType = "kph" | "mph" | "mps";

export default function Home() {
  const [locationState, setLocationState] = useState<LocationState>("idle");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [unit, setUnit] = useState<UnitType>("kph");
  const [rotationSpeed, setRotationSpeed] = useState<{
    kph: number;
    mph: number;
    mps: number;
  }>({ kph: 0, mph: 0, mps: 0 });
  const [isSavingLocation, setIsSavingLocation] = useState(false);
  const { toast } = useToast();

  // Initialize app with idle state
  useEffect(() => {
    // Reset to idle state on component mount
    setLocationState("idle");
    console.log("App initialized with state:", "idle");
  }, []);

  useEffect(() => {
    if (latitude !== null) {
      const speeds = calculateRotationSpeed(latitude);
      setRotationSpeed(speeds);
      
      // Save location to database when we get a new reading
      saveLocationToDatabase(latitude, longitude, speeds.kph);
    }
  }, [latitude, longitude]);
  
  // Save location data to the database
  const saveLocationToDatabase = async (lat: number | null, lng: number | null, speed: number) => {
    if (lat === null || lng === null) return;
    
    try {
      setIsSavingLocation(true);
      
      await fetch("/api/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          rotationSpeedKph: speed,
          // userId can be added when authentication is implemented
        }),
      });
      
      console.log("Location saved to database");
    } catch (error) {
      console.error("Error saving location:", error);
      // Not showing a toast here to avoid annoying users
    } finally {
      setIsSavingLocation(false);
    }
  };

  const getLocation = () => {
    console.log("getLocation called, previous state:", locationState);
    
    // Set loading state first
    setLocationState("loading");
    console.log("State changed to loading");
    
    // Clear any previous location data
    setLatitude(null);
    setLongitude(null);
    
    console.log("Getting location...");
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location retrieved:", position.coords);
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationState("success");
          console.log("State changed to success");
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location error",
            description: "We couldn't access your location. Please enable location services.",
            variant: "destructive",
          });
          setLocationState("error");
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation not supported");
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setLocationState("error");
    }
  };

  // Calculate current speed based on active unit
  const getCurrentSpeed = () => {
    if (unit === "kph") return rotationSpeed.kph;
    if (unit === "mph") return rotationSpeed.mph;
    return rotationSpeed.mps;
  };

  return (
    <div className="flex flex-col min-h-screen starry-sky text-white">
      <header className="py-4 px-6 bg-[#0a0e1f]/30 backdrop-blur-sm border-b border-white/5">
        <div className="container mx-auto">
          <h1 className="text-xl md:text-2xl font-bold flex items-center justify-center">
            <Globe className="mr-2 text-[#4DA8DA]" />
            <span className="bg-gradient-to-r from-blue-300 to-[#4DA8DA] text-transparent bg-clip-text">EarthSpin</span>
          </h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col">
        <LocationDisplay 
          status={locationState} 
          latitude={latitude} 
          longitude={longitude} 
          onRefresh={getLocation} 
        />
        
        <RotationSpeedDisplay 
          status={locationState}
          speeds={rotationSpeed} 
          activeUnit={unit} 
          onUnitChange={setUnit} 
          latitude={latitude}
          longitude={longitude}
        />
        
        {/* Always render the Share button if we have a valid speed to share */}
        {latitude !== null && (
          <>
            <Separator className="my-6 bg-white/20" />
            
            <ShareableCard
              latitude={latitude}
              longitude={longitude}
              speed={getCurrentSpeed()}
              unit={unit}
            />
          </>
        )}
        
        {/* Debug info */}
        <div className="text-xs text-white/30 mt-4 mb-2 text-center">
          Debug: State={locationState}, Lat={latitude?.toString() || "null"}, Speed={getCurrentSpeed()}
        </div>
        
        <EducationalContent speeds={rotationSpeed} />
      </main>

      <footer className="py-4 px-6 bg-[#0a0e1f]/30 backdrop-blur-sm border-t border-white/5">
        <div className="container mx-auto text-sm text-center text-white/70">
          <p className="text-[#4DA8DA]/90">EarthSpin - Experience the movement you never realized was happening.</p>
          <p className="mt-2">Calculations based on Earth's radius of 6,371 km and 24-hour rotation period.</p>
        </div>
      </footer>
    </div>
  );
}
