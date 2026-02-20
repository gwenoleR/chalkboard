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
  /** Mux upload ID (from the `comments` collection). Use `playbackId` for streaming. */
  videoId?: string;
  videoSource?: string;
  /** Mux playback ID — resolved via `_videos.details` subscription. */
  playbackId?: string;
  date: string;
  highlighted?: boolean;
}

/** EJSON date as returned by the DDP server before simpleddp deserialises it. */
export interface DdpDate {
  $date: number;
}

/**
 * A date field from a simpleddp collection.
 * simpleddp deserialises EJSON `{ $date: ms }` to a JS Date object,
 * but raw values or mock data may also be a string or the raw DdpDate object.
 */
export type DdpDateLike = Date | DdpDate | string;

/** Converts any DDP date variant to a JS Date. */
export function ddpDateToDate(d: DdpDateLike): Date {
  if (d instanceof Date) return d;
  if (typeof d === 'string') return new Date(d);
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
  createdAt: DdpDateLike;
  /**
   * Planned teardown date set by the gym.
   * Use `daysUntilTeardown(boulder.closedAt)` from lib/utils to get days remaining.
   */
  closedAt?: DdpDateLike;
  /** null = open; DdpDateLike = already closed (actual closure date) */
  isClosed: DdpDateLike | null;
  sentsCount: number;
  sentsList: string[];
  flashesCount: number;
  flashesList: string[];
  projectsList: string[];
  likesList: string[];
  likesCount: number;
  commentsCount: number;
}
