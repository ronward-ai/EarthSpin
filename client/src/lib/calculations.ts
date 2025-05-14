// Constants for Earth's properties
const EARTH_RADIUS_KM = 6371; // Earth's radius in kilometers
const HOURS_PER_DAY = 24; // Earth's rotation period

/**
 * Calculate the rotation speed at a given latitude
 * @param latitude - Latitude in degrees
 * @returns Object containing speeds in different units
 */
export function calculateRotationSpeed(latitude: number) {
  // Convert latitude to radians
  const latRad = (latitude * Math.PI) / 180;
  
  // Calculate the radius at this latitude
  const radiusAtLatitude = EARTH_RADIUS_KM * Math.cos(latRad);
  
  // Calculate the circumference at this latitude
  const circumferenceKm = 2 * Math.PI * radiusAtLatitude;
  
  // Calculate speed in km/h
  const speedKph = circumferenceKm / HOURS_PER_DAY;
  
  // Convert to other units
  const speedMph = speedKph * 0.621371; // km/h to mph
  const speedMps = speedKph / 3.6; // km/h to m/s
  
  return {
    kph: speedKph,
    mph: speedMph,
    mps: speedMps
  };
}
