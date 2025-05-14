import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Share, Download, Check, Copy } from "lucide-react";
import { formatNumber } from "@/lib/units";
import { useToast } from "@/hooks/use-toast";
import EarthVisualization from "./EarthVisualization";
import html2canvas from "html2canvas";

type ShareableCardProps = {
  latitude: number | null;
  longitude: number | null;
  speed: number;
  unit: "kph" | "mph" | "mps";
};

export default function ShareableCard({ latitude, longitude, speed, unit }: ShareableCardProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getUnitLabel = () => {
    if (unit === "kph") return "km/h";
    if (unit === "mph") return "mph";
    return "m/s";
  };

  const getShareText = () => {
    return `I'm spinning at ${formatNumber(speed)} ${getUnitLabel()} just by standing on Earth! Check your own rotation speed at ${window.location.origin}`;
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

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    
    try {
      // Convert the card div to a canvas
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher scale for better quality
        logging: false,
      });
      
      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL("image/png");
      
      // Create a temporary link element to download the image
      const link = document.createElement("a");
      link.download = `earthspin-${formatNumber(speed)}${getUnitLabel().replace('/', '')}.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Downloaded!",
        description: "Your shareable card has been downloaded.",
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: "Could not generate image for download",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3 text-[#4DA8DA]">Share Your Rotation Speed</h3>
      
      <div 
        ref={cardRef}
        className="p-6 bg-[#1C3359]/70 rounded-xl border border-[#4DA8DA]/20 backdrop-blur-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold text-white">EarthSpin</h4>
          <div className="h-8 w-8 bg-[#4DA8DA] rounded-full flex items-center justify-center">
            <span className="text-[#0A1128] font-bold text-sm">ES</span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="h-24 w-24 shrink-0">
            <EarthVisualization latitude={latitude} longitude={longitude} />
          </div>
          
          <div className="text-center md:text-left">
            <p className="text-sm text-white/70">Rotation Speed:</p>
            <p className="text-3xl font-bold text-white">{formatNumber(speed)} <span className="text-[#F2D399]">{getUnitLabel()}</span></p>
            
            {latitude !== null && (
              <p className="text-xs text-white/50 mt-1">
                At latitude {latitude.toFixed(2)}°
              </p>
            )}
          </div>
        </div>
        
        <p className="mt-4 text-sm text-white/70 italic">
          "That's how fast I'm moving through space just by standing on Earth!"
        </p>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button 
          onClick={handleShare} 
          className="flex-1 bg-[#4DA8DA] hover:bg-[#4DA8DA]/80"
          disabled={isDownloading}
        >
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Share className="h-4 w-4 mr-2" />}
          {copied ? "Copied!" : "Share"}
        </Button>
        
        <Button 
          onClick={handleDownload}
          variant="outline" 
          className="flex-1 border-[#4DA8DA] text-[#4DA8DA] hover:bg-[#4DA8DA]/10"
          disabled={isDownloading}
        >
          <Download className="h-4 w-4 mr-2" />
          {isDownloading ? "Processing..." : "Download"}
        </Button>
      </div>
    </div>
  );
}