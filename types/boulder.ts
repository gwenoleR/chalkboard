export interface Boulder {
  /** simpleddp stores the DDP id as `id` (not `_id`) */
  id: string;
  gym: string;
  /** 1–8, maps to a color name via Gym.labels */
  label: number;
  grade: string;
  holdsColor: string;
  routeTypes: string[];
  picture?: string;
  videoId?: string;
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
  commentsCount: number;
}
