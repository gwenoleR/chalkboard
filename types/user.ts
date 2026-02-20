import type { DdpDate } from './boulder';

export interface UserAvatars {
  url?: string;
}

export interface UserGymScores {
  /** Points per label index (key = label number as string) */
  points?: Record<string, number>;
  /** Send count per label index */
  counts?: Record<string, number>;
  /** Best grade per label index */
  bestGrades?: Record<string, string>;
  lastSend?: DdpDate | string;
  bestCount?: number;
  /** Current level label */
  label?: number;
}

export interface UserProfile {
  name: string;
  avatars?: UserAvatars;
  /** Keyed by gym slug */
  scores?: Record<string, UserGymScores>;
}

export interface User {
  /** simpleddp stores the DDP id as `id` (not `_id`) */
  id: string;
  profile: UserProfile;
  gyms?: string[];
  favoriteGyms?: string[];
  emails?: Array<{ address: string; verified: boolean }>;
  notificationsCount?: number;
}
