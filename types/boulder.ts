export interface BoulderPicture {
  id: string;
  width: number;
  ratio: number;
  crop?: { x: number; y: number; width: number; height: number };
}

export interface BoulderCommentUserProfile {
  name: string;
  avatars?: { none?: boolean; [key: string]: unknown };
  scores?: Record<string, unknown>;
}

/** A user post on a boulder: can contain text, a video, or both. */
export interface BoulderComment {
  /** simpleddp stores the DDP id as `id` */
  id: string;
  userId: string;
  boulderId: string;
  /** Parsed from the Astronomy-serialised userProfile field. */
  userProfile: BoulderCommentUserProfile;
  text: string;
  /** Mux video ID (present when the post contains a video). */
  videoId?: string;
  videoSource?: string;
  date: string;
  highlighted?: boolean;
}

/** EJSON date as returned by the DDP server. */
export interface DdpDate {
  $date: number;
}

/** Converts a DDP date object to a JS Date. */
export function ddpDateToDate(d: DdpDate): Date {
  return new Date(d.$date);
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
  /** Names of the route setters who created this boulder. */
  routeSetter?: string[];
  picture?: BoulderPicture;
  videosCount: number;
  /** Zone number in the gym, maps to Gym.zones */
  zone?: number;
  boulderNum?: number;
  createdAt: DdpDate | string;
  /**
   * Planned teardown date set by the gym.
   * Use `ddpDateToDate(boulder.closedAt)` to get a JS Date.
   * Display "dans X jours" = Math.ceil((closedAt.$date - Date.now()) / 86_400_000)
   */
  closedAt?: DdpDate;
  /** null = open, DdpDate = already closed */
  isClosed: DdpDate | null;
  sentsCount: number;
  sentsList: string[];
  flashesCount: number;
  flashesList: string[];
  projectsList: string[];
  likesList: string[];
  likesCount: number;
  commentsCount: number;
}
