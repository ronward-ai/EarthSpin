import { useState } from "react";

interface EarthGlobeProps {
  latitude: number;
  longitude: number;
  size?: number;
}

// Wikimedia Blue Marble — reliable CDN, equirectangular projection, 1024×512
const EARTH_IMAGE_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Blue_Marble_2002.png/1024px-Blue_Marble_2002.png";

export default function EarthGlobe({ latitude, longitude, size = 220 }: EarthGlobeProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Display the Earth at 1× — the full globe height fits inside the circle.
  // Equirectangular maps are 2:1 (width : height).
  const imgW = size * 2;
  const imgH = size;

  // Longitude → horizontal pixel in the displayed image.
  // Equirectangular: x = (lng + 180) / 360 * imgW
  const userX = ((longitude + 180) / 360) * imgW;

  // Shift image horizontally so the user's longitude sits at the horizontal
  // centre of the circle. No vertical shift — top of image = north pole,
  // equator = container centre, south pole = bottom.
  const bgPosX = size / 2 - userX;
  const bgPosY = 0;

  // The marker moves vertically to reflect the user's actual latitude.
  // y = 0 → north pole, y = imgH → south pole, y = imgH/2 → equator.
  const markerTop = ((90 - latitude) / 180) * imgH;

  return (
    <div
      className="relative mx-auto flex-shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow:
          "0 0 0 2px rgba(77,168,218,0.35), 0 0 32px rgba(77,168,218,0.22), 0 0 70px rgba(10,14,31,0.85)",
      }}
    >
      {/* Fallback gradient — shown while loading or if the texture fails */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #1C3359 0%, #0A1128 100%)",
          transition: "opacity 0.5s ease",
          opacity: imageLoaded && !imageError ? 0 : 1,
        }}
      />

      {/* Realistic Earth texture */}
      {!imageError && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${EARTH_IMAGE_URL})`,
            backgroundSize: `${imgW}px ${imgH}px`,
            backgroundPosition: `${bgPosX}px ${bgPosY}px`,
            // repeat-x handles the antimeridian seam gracefully
            backgroundRepeat: "repeat-x",
            opacity: imageLoaded ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />
      )}

      {/* Subtle equator reference line */}
      {imageLoaded && !imageError && (
        <div
          className="absolute w-full pointer-events-none"
          style={{
            top: imgH / 2,
            height: 1,
            background: "rgba(242,211,153,0.25)",
          }}
        />
      )}

      {/* Atmosphere / vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 32% 28%, rgba(120,190,255,0.15) 0%, transparent 52%), " +
            "radial-gradient(ellipse at center, transparent 52%, rgba(8,12,30,0.72) 100%)",
        }}
      />

      {/* Location marker — horizontal centre, vertical position reflects latitude */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: "50%",
          top: markerTop,
          transform: "translate(-50%, -50%)",
        }}
      >
        <span className="absolute w-5 h-5 rounded-full bg-[#F2D399]/30 animate-ping" />
        <span
          className="relative w-3 h-3 rounded-full bg-[#F2D399]"
          style={{ boxShadow: "0 0 8px 3px rgba(242,211,153,0.70)" }}
        />
      </div>

      {/* Hidden img — detects load / error for the texture */}
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
