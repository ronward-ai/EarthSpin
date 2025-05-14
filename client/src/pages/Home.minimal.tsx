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
        <Card className="bg-[#0a0e1f]/40 backdrop-blur-md border border-white/10 shadow-xl w-full max-w-md mb-8">
          <CardContent className="p-6">
            <div className="flex justify-center mb-6 mt-2">
              {!isLoading ? (
                <Button 
                  onClick={handleCalculateClick}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-lg shadow-blue-500/20 border border-blue-400/30" 
                  size="lg"
                >
                  Calculate My Rotation Speed
                </Button>
              ) : (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400 mx-auto mb-3"></div>
                  <p className="text-blue-200">Determining your location...</p>
                </div>
              )}
            </div>
            
            {latitude !== null && (
              <div className="text-center mt-2">
                <div className="text-lg text-blue-200 mb-2">At latitude {latitude.toFixed(4)}°, you are rotating at:</div>
                <div className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-300 to-blue-500 text-transparent bg-clip-text">
                  {formatNumber(speed)} km/h
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="p-4 bg-[#0a0e1f]/60 backdrop-blur-sm border-t border-white/10 relative z-10">
        <p className="text-center text-sm text-blue-200">EarthSpin - Experience Earth's rotation based on a radius of 6,371 km and 24-hour period</p>
      </footer>
    </div>
  );
}