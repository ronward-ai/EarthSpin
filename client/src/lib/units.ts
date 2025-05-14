/**
 * Format a number with commas as thousands separators
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return Math.round(num).toLocaleString();
}

/**
 * Get the display name for a unit
 * @param unit - Unit code
 * @returns Display name of the unit
 */
export function getUnitName(unit: "kph" | "mph" | "mps"): string {
  switch (unit) {
    case "kph":
      return "kilometers per hour";
    case "mph":
      return "miles per hour";
    case "mps":
      return "meters per second";
    default:
      return "";
  }
}

/**
 * Get the abbreviation for a unit
 * @param unit - Unit code
 * @returns Unit abbreviation
 */
export function getUnitAbbreviation(unit: "kph" | "mph" | "mps"): string {
  switch (unit) {
    case "kph":
      return "km/h";
    case "mph":
      return "mph";
    case "mps":
      return "m/s";
    default:
      return "";
  }
}
