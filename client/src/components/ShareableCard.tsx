import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share, Check } from "lucide-react";
import { formatNumber } from "@/lib/units";
import { useToast } from "@/hooks/use-toast";

type ShareableCardProps = {
  latitude: number | null;
  longitude: number | null;
  speed: number;
  unit: "kph" | "mph" | "mps";
};

export default function ShareableCard({ latitude, longitude, speed, unit }: ShareableCardProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const getUnitLabel = () => {
    if (unit === "kph") return "km/h";
    if (unit === "mph") return "mph";
    return "m/s";
  };

  const getShareText = () => {
    return `I'm spinning at ${formatNumber(speed)} ${getUnitLabel()}. Check your own Earth rotation speed at ${window.location.origin}`;
  };

  const handleShare = async () => {
    const shareText = getShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EarthSpin - Earth Rotation Speed',
          text: shareText,
          url: window.location.href,
        });
        toast({
          title: "Shared successfully",
          description: "Your rotation speed has been shared!",
        });
      } catch (error) {
        console.error('Error sharing:', error);
        fallbackCopy();
      }
    } else {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    navigator.clipboard.writeText(getShareText());
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Share text copied to clipboard!",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 mb-6 flex flex-col items-center">
      <Button 
        onClick={handleShare} 
        className="bg-[#4DA8DA] hover:bg-[#4DA8DA]/80 px-6 py-5 text-lg h-auto"
        size="lg"
      >
        {copied ? <Check className="h-5 w-5 mr-2" /> : <Share className="h-5 w-5 mr-2" />}
        {copied ? "Copied!" : "Share Your Rotation Speed"}
      </Button>
    </div>
  );
}