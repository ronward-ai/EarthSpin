import { useState, useEffect } from "react";
import LocationDisplay from "@/components/LocationDisplay";
import RotationSpeedDisplay from "@/components/RotationSpeedDisplay";
import EducationalContent from "@/components/EducationalContent";
import { calculateRotationSpeed } from "@/lib/calculations";
import { Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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

  useEffect(() => {
    if (locationState === "idle") {
      getLocation();
    }
  }, [locationState]);

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
    setLocationState("loading");
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationState("success");
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
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setLocationState("error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#0A1128] to-[#1C3359] text-white">
      <header className="py-4 px-6 bg-[#1C3359]/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <h1 className="text-xl md:text-2xl font-bold flex items-center justify-center">
            <Globe className="mr-2 text-[#4DA8DA]" />
            EarthSpin
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
          speeds={rotationSpeed} 
          activeUnit={unit} 
          onUnitChange={setUnit} 
          latitude={latitude}
        />
        
        <EducationalContent speeds={rotationSpeed} />
      </main>

      <footer className="py-4 px-6 bg-[#1C3359]/50 backdrop-blur-sm">
        <div className="container mx-auto text-sm text-center text-white/60">
          <p>EarthSpin - Experience the movement you never realized was happening.</p>
          <p className="mt-2">Calculations based on Earth's radius of 6,371 km and 24-hour rotation period.</p>
        </div>
      </footer>
    </div>
  );
}
