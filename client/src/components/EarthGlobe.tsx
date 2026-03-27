import { useState } from "react";

interface EarthGlobeProps {
  latitude: number;
  longitude: number;
  size?: number;
}

const EARTH_IMAGE_URL =
  "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57752/land_shallow_topo_2048.jpg";

export default function EarthGlobe({ latitude, longitude, size = 180 }: EarthGlobeProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Display the Earth image at 3× zoom so roughly 1/3 of the globe is visible
  // Equirectangular maps are 2:1 (width:height)
  const scale = 3;
  const imgW = size * scale * 2;
  const imgH = size * scale;

  // Convert lat/lng → pixel coordinates in the displayed image
  // x: 0° longitude is at the left; 180° is centre; 360° is right
  // y: 90° latitude (north pole) is at the top
  const userX = ((longitude + 180) / 360) * imgW;
  const userY = ((90 - latitude) / 180) * imgH;

  // Shift image so the user's position sits at the container centre
  const bgPosX = size / 2 - userX;
  const bgPosY = size / 2 - userY;

  return (
    <div
      className="relative mx-auto flex-shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow:
          "0 0 0 2px rgba(77,168,218,0.35), 0 0 30px rgba(77,168,218,0.25), 0 0 60px rgba(10,14,31,0.8)",
      }}
    >
      {/* Fallback gradient shown while the image loads or if it fails */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #1C3359 0%, #0A1128 100%)",
          transition: "opacity 0.5s ease",
          opacity: imageLoaded && !imageError ? 0 : 1,
        }}
      />

      {/* Realistic Earth texture — hidden on error so fallback gradient stays visible */}
      {!imageError && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${EARTH_IMAGE_URL})`,
            backgroundSize: `${imgW}px ${imgH}px`,
            backgroundPosition: `${bgPosX}px ${bgPosY}px`,
            backgroundRepeat: "repeat-x",
            opacity: imageLoaded ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />
      )}

      {/* Atmosphere / edge vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 30% 28%, rgba(120,190,255,0.18) 0%, transparent 55%), " +
            "radial-gradient(ellipse at center, transparent 55%, rgba(8,12,30,0.75) 100%)",
        }}
      />

      {/* Glowing location marker — always centred because the image is shifted to the user's location */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <span className="absolute w-5 h-5 rounded-full bg-[#F2D399]/30 animate-ping" />
        <span
          className="relative w-3 h-3 rounded-full bg-[#F2D399]"
          style={{ boxShadow: "0 0 8px 3px rgba(242,211,153,0.65)" }}
        />
      </div>

      {/* Hidden img element used only to detect when the texture has finished loading or fails */}
      <img
        src={EARTH_IMAGE_URL}
        alt=""
        className="hidden"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
    </div>
  );
}
