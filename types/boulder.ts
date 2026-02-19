export interface BoulderPicture {
  id: string;
  width: number;
  ratio: number;
  crop?: { x: number; y: number; width: number; height: number };
}

export interface Boulder {
  /** simpleddp stores the DDP id as `id` (not `_id`) */
  id: string;
  gym: string;
  /** 1–8, maps to a color name via Gym.labels */
  label: number;
  grade: string;
  /** Holds color code (numeric key into Gym.holdsColors / Gym.holdsColorsHexa) */
  holdsColor: number;
  routeTypes: number[];
  picture?: BoulderPicture;
  videosCount: number;
  /** Zone number in the gym, maps to Gym.zones */
  zone?: number;
  boulderNum?: number;
  createdAt: string;
  closedAt?: string;
  /** null = open, string date = closed */
  isClosed: string | null;
  sentsCount: number;
  sentsList: string[];
  flashesCount: number;
  flashesList: string[];
  projectsList: string[];
  likesList: string[];
  likesCount: number;
  commentsCount: number;
}
