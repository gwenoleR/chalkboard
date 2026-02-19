/**
 * Returns true if the given hex color is perceptually light (luminance > 0.73).
 * Use this to decide whether overlaid text should be dark or light.
 */
export function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
}

/**
 * Returns the hex color (black or white) that contrasts best against the given background.
 */
export function contrastColor(hex: string): '#000000' | '#ffffff' {
  return isLightColor(hex) ? '#000000' : '#ffffff';
}
