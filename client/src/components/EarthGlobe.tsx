import { ComposableMap, Geographies, Geography, Marker, Sphere, Graticule } from "react-simple-maps";

// Bundled TopoJSON — no external network request needed
// @ts-ignore – world-atlas has no TypeScript declarations
import countries from "world-atlas/countries-110m.json";

interface EarthGlobeProps {
  latitude: number;
  longitude: number;
  size?: number;
}

export default function EarthGlobe({ latitude, longitude, size = 220 }: EarthGlobeProps) {
  // Only rotate horizontally so the user's longitude faces the viewer.
  // Leaving the vertical tilt at 0 keeps the equator fixed at mid-height,
  // while the marker appears at the correct latitude position above/below it.
  const rotation: [number, number, number] = [-longitude, 0, 0];

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
      <ComposableMap
        projection="geoOrthographic"
        projectionConfig={{
          rotate: rotation,
          scale: size / 2,
        }}
        width={size}
        height={size}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        {/* Ocean */}
        <Sphere id="ocean" fill="#0b1e33" stroke="none" />

        {/* Latitude / longitude grid */}
        <Graticule stroke="rgba(77,168,218,0.15)" strokeWidth={0.5} />

        {/* Country polygons */}
        <Geographies geography={countries}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#1a4a6b"
                stroke="#2d7aad"
                strokeWidth={0.4}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {/* Atmosphere ring */}
        <Sphere
          id="atmosphere"
          fill="none"
          stroke="rgba(120,190,255,0.3)"
          strokeWidth={4}
        />

        {/* Rotation direction arrow — Earth spins west→east (left→right) */}
        <defs>
          <marker
            id="spin-dir-arrow"
            markerWidth={7}
            markerHeight={6}
            refX={7}
            refY={3}
            orient="auto"
          >
            <path d="M 0 0 L 7 3 L 0 6 Z" fill="rgba(77,168,218,0.65)" />
          </marker>
        </defs>
        {/* Quadratic bezier: left side → curves under equator → right side */}
        <path
          d={`M ${size * 0.15} ${size / 2 + 14} Q ${size / 2} ${size / 2 + 36} ${size * 0.85} ${size / 2 + 14}`}
          fill="none"
          stroke="rgba(77,168,218,0.5)"
          strokeWidth={1.5}
          markerEnd="url(#spin-dir-arrow)"
        />

        {/* User location marker — always at globe centre due to projection rotation */}
        <Marker coordinates={[longitude, latitude]}>
          {/* Outer pulsing ring — transform-box ensures scale origin is the circle centre */}
          <circle
            r={8}
            fill="rgba(242,211,153,0.25)"
            className="animate-ping"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
          {/* Solid dot */}
          <circle
            r={4}
            fill="#F2D399"
            stroke="rgba(242,211,153,0.55)"
            strokeWidth={3}
          />
        </Marker>
      </ComposableMap>
    </div>
  );
}
