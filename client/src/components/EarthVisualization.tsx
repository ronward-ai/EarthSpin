import { useEffect, useState } from "react";

type EarthVisualizationProps = {
  latitude: number | null;
  longitude: number | null;
};

export default function EarthVisualization({ latitude, longitude }: EarthVisualizationProps) {
  const [markerPosition, setMarkerPosition] = useState({ x: 50, y: 50 });

  // Calculate marker position based on latitude and longitude
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      // Convert latitude to y position (0 to 100%)
      // Equator is at 50%, North Pole at 0%, South Pole at 100%
      const y = ((90 - latitude) / 180) * 100;
      
      // Convert longitude to x position (0 to 100%)
      // -180° to +180° maps to 0% to 100%
      const x = ((longitude + 180) / 360) * 100;
      
      setMarkerPosition({ x, y });
    }
  }, [latitude, longitude]);

  return (
    <div className="relative mb-8 h-48 w-48 md:h-64 md:w-64 flex items-center justify-center">
      {/* Static Earth image */}
      <div className="absolute w-full h-full rounded-full overflow-hidden">
        <div className="w-full h-full earth-static"></div>
      </div>
      
      {/* Position marker */}
      {latitude !== null && longitude !== null && (
        <div 
          className="absolute w-3 h-3 bg-[#F2D399] rounded-full shadow-lg shadow-[#F2D399]/50 z-10"
          style={{ 
            left: `${markerPosition.x}%`, 
            top: `${markerPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <span className="absolute w-5 h-5 bg-[#F2D399]/30 rounded-full animate-ping" 
                style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}></span>
        </div>
      )}
    </div>
  );
}
