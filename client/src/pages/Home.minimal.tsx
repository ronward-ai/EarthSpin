import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share, Check, AlertCircle } from "lucide-react";
import EarthGlobe from "@/components/EarthGlobe";
import { calculateRotationSpeed } from "@/lib/calculations";
import { formatNumber, getUnitName } from "@/lib/units";
import { useToast } from "@/hooks/use-toast";
import EducationalContent from "@/components/EducationalContent";
import { ContactForm } from "@/components/ContactForm";

type UnitType = "kph" | "mph" | "mps";

export default function Home() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [unit, setUnit] = useState<UnitType>("mps");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  

  const { toast } = useToast();

  // Calculate speeds based on latitude
  const speeds = latitude !== null
    ? calculateRotationSpeed(latitude)
    : { kph: 0, mph: 0, mps: 0 };

  // Format latitude display
  const formatLatitude = (lat: number | null) => {
    if (lat === null) return "Unknown";
    return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}`;
  };

  // Format longitude display
  const formatLongitude = (lng: number | null) => {
    if (lng === null) return "Unknown";
    return `${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;
  };

  // Get current speed in the selected unit
  const getCurrentSpeed = () => {
    if (unit === "kph") return speeds.kph;
    if (unit === "mph") return speeds.mph;
    return speeds.mps;
  };

  // Get unit label
  const getUnitLabel = () => {
    if (unit === "kph") return "km/h";
    if (unit === "mph") return "mph";
    return "m/s";
  };


  function handleCalculateClick() {
    console.log("Button clicked");
    setIsLoading(true);
    setHasError(false);

    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      setHasError(true);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Got position:", position.coords.latitude);
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        // Save location
        saveLocation(position.coords.latitude, position.coords.longitude);

        setIsLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Location Access Denied",
          description: "Please enable location services to see your Earth rotation speed.",
          variant: "destructive"
        });
        setHasError(true);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // Save location to database
  function saveLocation(lat: number, lng: number) {
    fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitude: lat,
        longitude: lng,
        rotationSpeedKph: speeds.kph
      })
    }).catch(console.error);
  }

  // Handle share button click
  function handleShare() {
    if (!latitude) return;

    const shareText = `I'm spinning at ${formatNumber(getCurrentSpeed())} ${getUnitLabel()} due to Earth's rotation! Check your own speed at ${window.location.origin}`;

    if (navigator.share) {
      navigator.share({
        title: "EarthSpin - Earth's Rotation Speed",
        text: shareText,
        url: window.location.href
      }).catch(() => {
        handleCopy(shareText);
      });
    } else {
      handleCopy(shareText);
    }
  }

  // Copy to clipboard fallback
  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Share text copied!"
    });
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col min-h-screen text-white relative" style={{
      background: 'linear-gradient(to bottom, #0a0e1f 0%, #0e1d3b 100%)'
    }}>
      {/*
        Stars — two layers, each 200vw wide with stars mirrored in both halves.
        Sliding right→left by 100vw completes one seamless loop.
        Layer 1 (tiny, 120s) simulates distant stars; Layer 2 (slightly larger, 80s)
        simulates closer stars — the speed difference gives a subtle parallax.
      */}

      {/* Layer 1: small distant stars, slow drift */}
      <div
        className="fixed top-0 left-0 h-full pointer-events-none"
        style={{
          width: '200vw',
          animation: 'star-drift-slow 120s linear infinite',
          backgroundImage: `
            radial-gradient(1px 1px at  3%  12%, white, transparent),
            radial-gradient(1px 1px at  7%  65%, white, transparent),
            radial-gradient(1px 1px at 12%  35%, white, transparent),
            radial-gradient(1px 1px at 18%  80%, white, transparent),
            radial-gradient(1px 1px at 23%  18%, white, transparent),
            radial-gradient(1px 1px at 29%  52%, white, transparent),
            radial-gradient(1px 1px at 34%  88%, white, transparent),
            radial-gradient(1px 1px at 40%  28%, white, transparent),
            radial-gradient(1px 1px at 45%  72%, white, transparent),
            radial-gradient(1px 1px at  2%  45%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 16%  92%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 37%   6%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 53%  12%, white, transparent),
            radial-gradient(1px 1px at 57%  65%, white, transparent),
            radial-gradient(1px 1px at 62%  35%, white, transparent),
            radial-gradient(1px 1px at 68%  80%, white, transparent),
            radial-gradient(1px 1px at 73%  18%, white, transparent),
            radial-gradient(1px 1px at 79%  52%, white, transparent),
            radial-gradient(1px 1px at 84%  88%, white, transparent),
            radial-gradient(1px 1px at 90%  28%, white, transparent),
            radial-gradient(1px 1px at 95%  72%, white, transparent),
            radial-gradient(1px 1px at 52%  45%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 66%  92%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 87%   6%, rgba(255,255,255,0.6), transparent)
          `,
          opacity: 0.8
        }}
      />

      {/* Layer 2: slightly larger stars, faster drift — creates parallax depth */}
      <div
        className="fixed top-0 left-0 h-full pointer-events-none"
        style={{
          width: '200vw',
          animation: 'star-drift-fast 80s linear infinite',
          backgroundImage: `
            radial-gradient(1.5px 1.5px at  5%  30%, white, transparent),
            radial-gradient(1.5px 1.5px at 15%   8%, white, transparent),
            radial-gradient(1.5px 1.5px at 26%  55%, white, transparent),
            radial-gradient(1.5px 1.5px at 35%  82%, white, transparent),
            radial-gradient(1.5px 1.5px at 43%  22%, white, transparent),
            radial-gradient(2px   2px   at 10%  70%, rgba(255,255,255,0.9), transparent),
            radial-gradient(2px   2px   at 32%  42%, rgba(255,255,255,0.9), transparent),
            radial-gradient(2px   2px   at 48%  15%, rgba(255,255,255,0.9), transparent),
            radial-gradient(1.5px 1.5px at 55%  30%, white, transparent),
            radial-gradient(1.5px 1.5px at 65%   8%, white, transparent),
            radial-gradient(1.5px 1.5px at 76%  55%, white, transparent),
            radial-gradient(1.5px 1.5px at 85%  82%, white, transparent),
            radial-gradient(1.5px 1.5px at 93%  22%, white, transparent),
            radial-gradient(2px   2px   at 60%  70%, rgba(255,255,255,0.9), transparent),
            radial-gradient(2px   2px   at 82%  42%, rgba(255,255,255,0.9), transparent),
            radial-gradient(2px   2px   at 98%  15%, rgba(255,255,255,0.9), transparent)
          `,
          opacity: 0.85
        }}
      />

      <header className="py-5 px-4 bg-[#0a0e1f]/70 backdrop-blur-md border-b border-white/10 relative z-10">
        <div className="flex flex-col items-center gap-2">

          {/* Custom globe SVG logo */}
          <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="hdr-earth" cx="38%" cy="32%" r="65%">
                <stop offset="0%"   stopColor="#2d8abf" />
                <stop offset="100%" stopColor="#071525" />
              </radialGradient>
              <radialGradient id="hdr-glow" cx="50%" cy="50%" r="50%">
                <stop offset="60%"  stopColor="transparent" />
                <stop offset="100%" stopColor="rgba(77,168,218,0.35)" />
              </radialGradient>
            </defs>
            {/* Earth fill */}
            <circle cx="27" cy="27" r="19" fill="url(#hdr-earth)" />
            {/* Latitude lines */}
            <ellipse cx="27" cy="27" rx="19" ry="6.5" fill="none" stroke="rgba(77,168,218,0.45)" strokeWidth="0.8" />
            <ellipse cx="27" cy="20" rx="15"  ry="4.5"  fill="none" stroke="rgba(77,168,218,0.25)" strokeWidth="0.7" />
            <ellipse cx="27" cy="34" rx="15"  ry="4.5"  fill="none" stroke="rgba(77,168,218,0.25)" strokeWidth="0.7" />
            {/* Meridian lines */}
            <ellipse cx="27" cy="27" rx="9"  ry="19" fill="none" stroke="rgba(77,168,218,0.35)" strokeWidth="0.8" />
            <ellipse cx="27" cy="27" rx="19" ry="19" fill="none" stroke="rgba(77,168,218,0.15)" strokeWidth="0.7" />
            {/* Atmosphere edge glow */}
            <circle cx="27" cy="27" r="19" fill="url(#hdr-glow)" />
            <circle cx="27" cy="27" r="19" fill="none" stroke="rgba(120,190,255,0.5)" strokeWidth="2" />
            {/* Orbital ring */}
            <ellipse cx="27" cy="27" rx="26" ry="9" fill="none"
              stroke="rgba(77,168,218,0.55)" strokeWidth="1.2"
              strokeDasharray="3.5 2.5"
              transform="rotate(-28 27 27)" />
            {/* Satellite dot on ring */}
            <circle cx="50.5" cy="21.5" r="2.2" fill="#F2D399" opacity="0.95" />
            <circle cx="50.5" cy="21.5" r="4"   fill="rgba(242,211,153,0.2)" />
          </svg>

          {/* Title */}
          <h1
            className="text-3xl tracking-[0.25em] text-transparent bg-clip-text select-none"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900,
              backgroundImage: 'linear-gradient(90deg, #93c5fd 0%, #60a5fa 40%, #bfdbfe 70%, #60a5fa 100%)',
              letterSpacing: '0.25em',
            }}
          >
            EARTHSPIN
          </h1>


        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center relative z-10">
        {/* Location Card */}
        <Card className="bg-[#0a0e1f]/40 backdrop-blur-md border border-white/10 shadow-xl w-full max-w-md mb-5">
          <CardContent className="p-3">

            {/* Initial state */}
            {latitude === null && !isLoading && !hasError && (
              <div className="py-2 flex flex-col items-center gap-2">
                <p className="text-xs opacity-60 text-center">
                  Find out how fast you're spinning on Earth
                </p>
                <Button
                  onClick={handleCalculateClick}
                  className="bg-gradient-to-r from-[#4DA8DA] to-[#2A7DA8] hover:from-[#3A97C9] hover:to-[#1A6C97] text-white px-6 border border-blue-400/30 shadow-lg shadow-blue-500/20"
                >
                  Calculate My Speed
                </Button>
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="py-2 flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#4DA8DA]"></div>
                <span className="text-xs opacity-60">Determining your location…</span>
              </div>
            )}

            {/* Error state */}
            {hasError && !isLoading && (
              <div className="py-1 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-[#E63946]" />
                  <p className="text-xs text-[#E63946] truncate">Location access denied</p>
                </div>
                <Button
                  onClick={handleCalculateClick}
                  size="sm"
                  className="bg-gradient-to-r from-[#4DA8DA] to-[#2A7DA8] hover:from-[#3A97C9] hover:to-[#1A6C97] text-white border border-blue-400/30 flex-shrink-0"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Success state — compact single row */}
            {latitude !== null && !isLoading && (
              <div className="flex items-center justify-center gap-6 py-1">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-wider opacity-50 mb-0.5">Latitude</div>
                  <p className="text-sm font-medium text-blue-200">{formatLatitude(latitude)}</p>
                </div>
                <div className="w-px h-6 bg-white/15" />
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-wider opacity-50 mb-0.5">Longitude</div>
                  <p className="text-sm font-medium text-blue-200">{formatLongitude(longitude)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Earth Visualization and Speed */}
        {latitude !== null && !isLoading && (
          <div className="w-full max-w-md mb-8">
            {/* Connector: location card → globe */}
            <div className="w-px h-5 bg-white/15 mx-auto -mt-3 mb-0" />

            {/* Earth visualization */}
            <div className="mb-8 mt-2">
              <EarthGlobe latitude={latitude} longitude={longitude ?? 0} size={220} />
            </div>

            {/* Speed display */}
            <div className="text-center mb-6">
              <h2 className="font-medium text-xl md:text-2xl mb-2 text-[#F2D399]">You are spinning at</h2>

              <div className="flex items-stretch justify-center gap-3 my-4">
                <span
                  className="font-bold text-white"
                  style={{ fontSize: '3rem', lineHeight: 1 }}
                >
                  {formatNumber(getCurrentSpeed())}
                </span>
                {unit === "mps" ? (
                  <span className="flex flex-col justify-between font-bold text-white" style={{ lineHeight: 1 }}>
                    {['metres', 'per', 'second'].map(w => (
                      <span
                        key={w}
                        style={{ fontSize: '1rem', lineHeight: 1 }}
                      >{w}</span>
                    ))}
                  </span>
                ) : (
                  <span
                    className="font-bold text-white"
                    style={{ fontSize: '3rem', lineHeight: 1 }}
                  >
                    {getUnitLabel()}
                  </span>
                )}
              </div>

              <div className="inline-flex bg-[#1C3359]/30 backdrop-blur-sm rounded-full p-1 mb-4">
                <Button
                  variant={unit === "kph" ? "default" : "ghost"}
                  className={`px-4 py-2 rounded-full ${
                    unit === "kph"
                      ? "bg-[#4DA8DA]/80 text-white border border-transparent"
                      : "text-white/60 hover:text-white border border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                  onClick={() => setUnit("kph")}
                >
                  km/h
                </Button>
                <Button
                  variant={unit === "mph" ? "default" : "ghost"}
                  className={`px-4 py-2 rounded-full ${
                    unit === "mph"
                      ? "bg-[#4DA8DA]/80 text-white border border-transparent"
                      : "text-white/60 hover:text-white border border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                  onClick={() => setUnit("mph")}
                >
                  mph
                </Button>
                <Button
                  variant={unit === "mps" ? "default" : "ghost"}
                  className={`px-4 py-2 rounded-full ${
                    unit === "mps"
                      ? "bg-[#4DA8DA]/80 text-white border border-transparent"
                      : "text-white/60 hover:text-white border border-white/20 bg-white/5 hover:bg-white/10"
                  }`}
                  onClick={() => setUnit("mps")}
                >
                  m/s
                </Button>
              </div>
              <div className="mt-3 mb-2">
                <Button
                  onClick={handleShare}
                  className="border border-[#4DA8DA] text-[#4DA8DA] bg-transparent hover:bg-[#4DA8DA]/10 px-6"
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Share className="h-4 w-4 mr-2" />}
                  {copied ? "Copied!" : "Share Your Rotation Speed"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Educational Content */}
        {latitude !== null && !isLoading && (
          <EducationalContent speeds={speeds} />
        )}
      </main>

      <footer className="p-4 bg-[#0a0e1f]/60 backdrop-blur-sm border-t border-white/10 relative z-10">
        <div className="text-center text-sm text-white/70">
          <div className="text-[#4DA8DA]/90">
            © 2025 EarthSpin is a project by Artist{" "}
            <span className="text-[#F2D399]">Ron Ward</span> •{" "}
            <ContactForm>
              <button className="text-[#4DA8DA] hover:text-[#4DA8DA]/80 transition-colors underline cursor-pointer bg-transparent border-none p-0 font-inherit">
                contact
              </button>
            </ContactForm>
          </div>
        </div>
      </footer>
    </div>
  );
}