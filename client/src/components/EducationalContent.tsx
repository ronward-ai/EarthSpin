import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";

type EducationalContentProps = {
  speeds: {
    kph: number;
    mph: number;
    mps: number;
  };
};

export default function EducationalContent({ speeds }: EducationalContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="bg-[#1C3359]/30 rounded-xl backdrop-blur-md border-none mb-6">
      <CardContent className="p-6">
        <div 
          className="flex items-center justify-between cursor-pointer" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="font-medium text-lg text-[#4DA8DA]">Earth Rotation Facts</h2>
          <ChevronDown 
            className={`transform transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`} 
          />
        </div>
        
        <div 
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? "max-h-[1000px] pt-4" : "max-h-0"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-[#F2D399] mb-2">Earth's rotation</h3>
              <p className="text-sm leading-relaxed opacity-85">
                Earth rotates on its axis, completing one full rotation every 24 hours. This rotation is what gives us day and night. The speed of rotation varies depending on your latitude - it's fastest at the equator (about 1,670 km/h) and slows down as you move toward the poles.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-[#F2D399] mb-2">Why don't we feel this movement?</h3>
              <p className="text-sm leading-relaxed opacity-85">
                We don't feel Earth's rotation because everything around us - including the atmosphere - is moving at the same speed. It's like being in a smooth-moving vehicle: when traveling at a constant speed with no acceleration or deceleration, you don't feel the motion.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-[#F2D399] mb-2">Earth's journey through space</h3>
              <p className="text-sm leading-relaxed opacity-85">
                Beyond rotation, Earth orbits the Sun at about 107,000 km/h. Our solar system also moves through the Milky Way at about 828,000 km/h. The Milky Way itself is moving through space at about 2.1 million km/h!
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-[#F2D399] mb-2">Calculating rotation speed</h3>
              <p className="text-sm leading-relaxed opacity-85">
                The speed at any latitude is calculated using the formula: <span className="bg-white/10 px-2 py-1 rounded font-mono text-xs">Speed = Earth's circumference at that latitude ÷ 24 hours</span>. This is why speed decreases as you move away from the equator.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
