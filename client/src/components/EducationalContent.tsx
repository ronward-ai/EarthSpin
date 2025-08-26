import { formatNumber } from "@/lib/units";

type EducationalContentProps = {
  speeds: {
    kph: number;
    mph: number;
    mps: number;
  };
};

export default function EducationalContent({ speeds }: EducationalContentProps) {
  return (
    <div className="w-full max-w-md bg-[#0a0e1f]/40 backdrop-blur-md border border-white/10 shadow-xl rounded-xl p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-[#4DA8DA]">Earth's Rotation</h2>
      
      <div className="space-y-4 text-sm">
        <p>
          Our planet completes one full rotation on its axis every 24 hours, creating day and night. This constant 
          movement means everyone on Earth is always in motion, even when standing still.
        </p>
        
        <div className="bg-[#1C3359]/30 p-4 rounded-lg">
          <p className="font-medium mb-2">Did you know?</p>
          <ul className="list-disc list-inside space-y-2 text-blue-200 opacity-90">
            <li>People at the equator travel the fastest at about 1,670 km/h</li>
            <li>Someone standing at the North or South Pole barely moves at all</li>
            <li>Earth also orbits the Sun at approximately 107,000 km/h</li>
            <li>The entire solar system orbits the center of the Milky Way at about 828,000 km/h</li>
          </ul>
        </div>
        
        <div>
          <p className="font-medium mb-2">How we calculate your rotation speed:</p>
          <div className="text-blue-200 opacity-90 space-y-2">
            <p className="text-xs">
              <span className="font-medium">Step 1:</span> Find the radius at your latitude using cosine: 6,371 km × cos(latitude)
            </p>
            <p className="text-xs">
              <span className="font-medium">Step 2:</span> Calculate the circumference: 2π × radius
            </p>
            <p className="text-xs">
              <span className="font-medium">Step 3:</span> Divide by 24 hours to get your speed
            </p>
            <div className="mt-3 p-3 bg-[#4DA8DA]/10 rounded border border-[#4DA8DA]/20">
              <p className="text-xs font-mono">
                Speed = (2π × 6,371 km × cos(latitude)) ÷ 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}