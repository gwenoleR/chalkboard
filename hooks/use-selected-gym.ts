import { useCallback, useEffect, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'selectedGym';

/**
 * Reads the currently selected gym from AsyncStorage.
 * Returns null if no gym has been selected yet (triggers onboarding).
 */
async function readSelectedGym(): Promise<string | null> {
  return AsyncStorage.getItem(STORAGE_KEY);
}

/**
 * Persists the selected gym to AsyncStorage.
 */
async function writeSelectedGym(gymId: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, gymId);
}

interface UseSelectedGymResult {
  gymId: string | null;
  isLoading: boolean;
  setGymId: (gymId: string) => Promise<void>;
}

/**
 * Reactive hook for the user's selected gym.
 * Returns null while loading or if no gym has been chosen yet.
 * Call setGymId to persist a new selection and trigger a re-render.
 */
export function useSelectedGym(): UseSelectedGymResult {
  const [gymId, setGymIdState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    readSelectedGym().then((stored) => {
      setGymIdState(stored);
      setIsLoading(false);
    });
  }, []);

  const setGymId = useCallback(async (id: string) => {
    await writeSelectedGym(id);
    setGymIdState(id);
  }, []);

  return { gymId, isLoading, setGymId };
}
