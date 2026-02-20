import { useEffect, useState } from 'react';

import client, { ensureLoggedIn } from '@/lib/ddp/client';
import { getLastGym, setLastGym } from '@/lib/last-gym';
import type { Boulder } from '@/types/boulder';
import type { Gym } from '@/types/gym';

const SORT = { isClosed: 1, createdAt: -1, boulderNum: -1, label: -1, holdsColor: -1 };

interface UseBoulder {
  boulder: Boulder | null;
  gym: Gym | null;
  loading: boolean;
  error: string | null;
}

/**
 * Fetches a single boulder by ID plus its gym data.
 * Uses already-populated collection data as a fast path (when navigating from the list).
 * Falls back to a targeted DDP subscription when deep-linking or fast-reloading,
 * using the last visited gym stored in AsyncStorage as the selector hint.
 */
export function useBoulder(id: string): UseBoulder {
  const [boulder, setBoulder] = useState<Boulder | null>(null);
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let boulderSub: ReturnType<typeof client.subscribe> | null = null;
    let gymSub: ReturnType<typeof client.subscribe> | null = null;

    async function load() {
      try {
        await ensureLoggedIn();

        // Fast path: boulder already in collection from the list screen
        let found =
          (client.collection('boulders').fetch({}) as Boulder[]).find((b) => b.id === id) ?? null;

        if (found) {
          // Persist the gym so fast-reload and deep-links can use it as a subscription hint
          setLastGym(found.gym);
        }

        if (!found) {
          const gym = await getLastGym();
          boulderSub = client.subscribe('_boulders.list', { gym, isClosed: null }, SORT, 200, null);
          await boulderSub.ready();
          const allBoulders = client.collection('boulders').fetch({}) as Boulder[];
          found = allBoulders.find((b) => b.id === id) ?? null;
          if (found) setLastGym(found.gym);
        }

        if (!found) {
          setLoading(false);
          return;
        }
        setBoulder(found);

        // Fast path: gym may already be cached
        let foundGym =
          (client.collection('gyms').fetch({}) as Gym[]).find((g) => g.slug === found!.gym) ?? null;
        if (foundGym) {
          setGym(foundGym);
          setLoading(false);
        }

        if (!foundGym) {
          gymSub = client.subscribe('_gyms.info', found.gym);
          await gymSub.ready();
          foundGym =
            (client.collection('gyms').fetch({}) as Gym[]).find((g) => g.slug === found!.gym) ??
            null;
        }
        setGym(foundGym);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => {
      boulderSub?.stop();
      gymSub?.stop();
    };
  }, [id]);

  return { boulder, gym, loading, error };
}
