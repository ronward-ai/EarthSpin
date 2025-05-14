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
          <p className="font-medium mb-2">Compared to your rotation speed:</p>
          <ul className="space-y-1 text-blue-200 opacity-90">
            <li>
              The International Space Station orbits Earth at {formatNumber(27600)} km/h, which is about {formatNumber(27600/speeds.kph)} times faster than you're spinning
            </li>
            <li>
              Commercial airplanes fly at around {formatNumber(900)} km/h, approximately {speeds.kph > 900 ? `${formatNumber(speeds.kph/900)}× slower than` : `${formatNumber(900/speeds.kph)}× faster than`} your rotation speed
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}