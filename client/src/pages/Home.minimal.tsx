import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { calculateRotationSpeed } from "@/lib/calculations";
import { formatNumber } from "@/lib/units";

export default function Home() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [speed, setSpeed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  function handleCalculateClick() {
    console.log("Button clicked");
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Got position:", position.coords.latitude);
        setLatitude(position.coords.latitude);
        
        // Calculate speed
        const calculatedSpeed = calculateRotationSpeed(position.coords.latitude);
        setSpeed(calculatedSpeed.kph);
        
        setIsLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Could not get your location");
        setIsLoading(false);
      }
    );
  }

  return (
    <div className="flex flex-col min-h-screen starry-sky text-white">
      <header className="p-4 bg-blue-900/30 backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-center flex items-center justify-center">
          <Globe className="mr-2" />
          EarthSpin
        </h1>
      </header>

      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center">
        <Card className="bg-blue-900/20 w-full max-w-md mb-8">
          <CardContent className="p-6">
            <div className="flex justify-center mb-4">
              {!isLoading ? (
                <Button 
                  onClick={handleCalculateClick}
                  className="bg-blue-500 hover:bg-blue-600" 
                  size="lg"
                >
                  Calculate My Rotation Speed
                </Button>
              ) : (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p>Determining location...</p>
                </div>
              )}
            </div>
            
            {latitude !== null && (
              <div className="text-center">
                <div className="text-lg opacity-80 mb-2">At latitude {latitude.toFixed(4)}°, you are rotating at:</div>
                <div className="text-5xl font-bold mb-4">{formatNumber(speed)} km/h</div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="p-4 bg-blue-900/30 backdrop-blur-sm">
        <p className="text-center text-sm opacity-70">EarthSpin - Earth's radius of 6,371 km and 24-hour rotation period</p>
      </footer>
    </div>
  );
}