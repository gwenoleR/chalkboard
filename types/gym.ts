export interface GymZone {
  name: string;
  left?: string;
  right?: string;
}

export interface GymMapLine {
  zone: number;
  points: string;
}

export interface GymMapData {
  lines: GymMapLine[];
  viewBox: string;
}

export interface Gym {
  /** simpleddp stores the DDP id as `id` (Mongo _id hash) */
  id: string;
  /** Gym identifier used in boulder references, e.g. "wattabloc" */
  slug: string;
  name: string;
  /** Maps label number to color name, e.g. { "1": "jaune", "2": "bleu" } */
  labels: Record<string, string>;
  /** Maps label number to hex color, e.g. { "1": "#f5e642" } */
  labelsHexa: Record<string, string>;
  /** Maps label number to grade range */
  grades: Record<string, string[]>;
  holdsColors: Record<string, string>;
  holdsColorsHexa: Record<string, string[]>;
  /** Array of [id, [name, ...flags]] tuples — use getRouteTypeName() to resolve */
  routeTypes?: Array<[number, [string, ...boolean[]]]>;
  /** Maps zone number to zone info */
  zones: Record<string, GymZone>;
  /** SVG floor plan data */
  map?: GymMapData;
  bouldersLifeLength: number;
}
