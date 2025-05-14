import { useState } from "react";
import { Button } from "@/components/ui/button";
import EarthVisualization from "./EarthVisualization";

type RotationSpeedDisplayProps = {
  status: "idle" | "loading" | "success" | "error";
  speeds: {
    kph: number;
    mph: number;
    mps: number;
  };
  activeUnit: "kph" | "mph" | "mps";
  onUnitChange: (unit: "kph" | "mph" | "mps") => void;
  latitude: number | null;
  longitude: number | null;
};

export default function RotationSpeedDisplay({
  status,
  speeds,
  activeUnit,
  onUnitChange,
  latitude,
  longitude,
}: RotationSpeedDisplayProps) {
  const formatSpeed = (speed: number) => {
    return Math.round(speed).toLocaleString();
  };

  const getDisplaySpeed = () => {
    if (activeUnit === "kph") return formatSpeed(speeds.kph);
    if (activeUnit === "mph") return formatSpeed(speeds.mph);
    return formatSpeed(speeds.mps);
  };

  const getUnitLabel = () => {
    if (activeUnit === "kph") return "km/h";
    if (activeUnit === "mph") return "mph";
    return "m/s";
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center my-4 md:my-8 relative">
      <div className="absolute w-52 h-52 md:w-72 md:h-72 bg-[#4DA8DA] opacity-5 rounded-full"></div>
      
      <EarthVisualization latitude={latitude} longitude={longitude} />
      
      {status === "idle" ? (
        <div className="text-center mb-6 opacity-70">
          <h2 className="font-medium text-xl md:text-2xl mb-2 text-[#F2D399]">Discover Your Rotation Speed</h2>
          <p className="max-w-md mx-auto text-sm">
            Click the Calculate button above to find out how fast you're spinning on Earth right now.
          </p>
        </div>
      ) : (
        <div className="text-center mb-6">
          <h2 className="font-medium text-xl md:text-2xl mb-2 text-[#F2D399]">
            {status === "success" ? "You are spinning at" : "Calculating speed..."}
          </h2>
          
          {status === "success" && (
            <>
              <div className="text-5xl md:text-7xl font-bold my-4">
                {getDisplaySpeed()}
              </div>
              
              <div className="inline-flex bg-[#1C3359]/30 backdrop-blur-sm rounded-full p-1 mb-4">
                <Button
                  variant={activeUnit === "kph" ? "default" : "ghost"}
                  className={`px-4 py-2 rounded-full ${
                    activeUnit === "kph" 
                      ? "bg-[#4DA8DA]/80 text-white" 
                      : "text-white/70 hover:text-white"
                  }`}
                  onClick={() => onUnitChange("kph")}
                >
                  km/h
                </Button>
                <Button
                  variant={activeUnit === "mph" ? "default" : "ghost"}
                  className={`px-4 py-2 rounded-full ${
                    activeUnit === "mph" 
                      ? "bg-[#4DA8DA]/80 text-white" 
                      : "text-white/70 hover:text-white"
                  }`}
                  onClick={() => onUnitChange("mph")}
                >
                  mph
                </Button>
                <Button
                  variant={activeUnit === "mps" ? "default" : "ghost"}
                  className={`px-4 py-2 rounded-full ${
                    activeUnit === "mps" 
                      ? "bg-[#4DA8DA]/80 text-white" 
                      : "text-white/70 hover:text-white"
                  }`}
                  onClick={() => onUnitChange("mps")}
                >
                  m/s
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
