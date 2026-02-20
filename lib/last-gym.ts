import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'lastGym';
const DEFAULT_GYM = 'wattabloc';

/**
 * Returns the last gym the user visited, or the default gym if none stored yet.
 * Used as a fallback gym hint when deep-linking to a boulder without context.
 */
export async function getLastGym(): Promise<string> {
  return (await AsyncStorage.getItem(KEY)) ?? DEFAULT_GYM;
}

/**
 * Persists the current gym. Fire-and-forget — called whenever a boulder is loaded.
 */
export function setLastGym(gym: string): void {
  AsyncStorage.setItem(KEY, gym);
}
