import { useEffect, useState } from "react";

type EarthVisualizationProps = {
  latitude: number | null;
};

export default function EarthVisualization({ latitude }: EarthVisualizationProps) {
  const [markerPosition, setMarkerPosition] = useState({ top: 35, right: 30 });

  // Update marker position based on latitude
  useEffect(() => {
    if (latitude !== null) {
      // Convert latitude to position on the visualization (-90 to 90)
      // Map to position on the sphere (0% to 100%)
      const top = ((90 - latitude) / 180) * 100;
      
      // Add some randomization to horizontal position for visual effect
      // In a real app, this could be based on longitude
      const right = 30 + (Math.random() * 40); 
      
      setMarkerPosition({ top, right });
    }
  }, [latitude]);

  return (
    <div className="relative mb-8 h-40 w-40 md:h-52 md:w-52 flex items-center justify-center">
      {/* Earth visualization */}
      <div className="absolute w-full h-full rounded-full overflow-hidden earth-rotation">
        <div className="w-full h-full earth-map"></div>
      </div>
      
      {/* Latitude indicator line */}
      <div className="absolute w-full h-0.5 bg-[#F2D399]/70 shadow-lg shadow-[#F2D399]/30"></div>
      
      {/* Position marker */}
      {latitude !== null && (
        <div 
          className="absolute w-3 h-3 bg-[#F2D399] rounded-full shadow-lg shadow-[#F2D399]/50"
          style={{ 
            right: `${markerPosition.right}%`, 
            top: `${markerPosition.top}%` 
          }}
        >
          <span className="absolute w-5 h-5 bg-[#F2D399]/30 rounded-full animate-ping"></span>
        </div>
      )}
    </div>
  );
}
