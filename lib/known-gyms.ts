export interface GymInfo {
  id: string;
  name: string;
  city: string;
  /** S3 path used to build the logo URL, e.g. "wattabloc" or "arkose/massy" */
  filesGym?: string;
  /** Logo file extension: "png" | "webp" | "svg" */
  logoType?: string;
}

const S3 = 'https://socialboulder.s3-eu-west-1.amazonaws.com';

/** Returns the logo URL for a gym, or undefined if logo data is missing. */
export function getGymLogoUrl(gym: GymInfo): string | undefined {
  if (!gym.filesGym || !gym.logoType) return undefined;
  return `${S3}/gyms/${gym.filesGym}/logo.${gym.logoType}`;
}

/**
 * Static list of known Social Boulder gyms.
 * Used as a fallback when the user is not logged in (no user.gyms from DDP).
 * Sub-gyms (e.g. wattabloc/pans) are listed separately so they can be displayed
 * as distinct options.
 */
export const KNOWN_GYMS: GymInfo[] = [
  { id: 'wattabloc', name: 'Wattabloc', city: 'Paris', filesGym: 'wattabloc', logoType: 'png' },
  { id: 'wattabloc/pans', name: 'Wattabloc – Pans', city: 'Paris', filesGym: 'wattabloc', logoType: 'png' },
  { id: 'wattabloc/spraywall', name: 'Wattabloc – Spraywall', city: 'Paris', filesGym: 'wattabloc', logoType: 'png' },
  { id: 'isatix', name: 'Isatix', city: 'Paris', filesGym: 'isatix', logoType: 'png' },
  { id: 'auperchoir', name: 'Au Perchoir', city: 'Paris', filesGym: 'auperchoir', logoType: 'svg' },
  { id: 'arkose', name: 'Arkose Nation', city: 'Paris', filesGym: 'arkose', logoType: 'svg' },
  { id: 'arkose/massy', name: 'Arkose Massy', city: 'Massy', filesGym: 'arkose/massy', logoType: 'webp' },
  { id: 'sb', name: 'SB', city: '', filesGym: 'sb', logoType: 'svg' },
];

/**
 * Returns the display name for a gym ID.
 * Falls back to the raw ID if the gym is not in the known list.
 */
export function getGymDisplayName(gymId: string): string {
  return KNOWN_GYMS.find((g) => g.id === gymId)?.name ?? gymId;
}
