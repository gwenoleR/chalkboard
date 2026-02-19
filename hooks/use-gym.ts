import { useEffect, useState } from 'react';

import client, { ensureLoggedIn } from '@/lib/ddp/client';
import type { Gym } from '@/types/gym';

/**
 * Subscribes to a single gym's info by slug.
 * Returns null while loading or if the gym is not found.
 */
export function useGym(gymId: string): { gym: Gym | null; loading: boolean } {
  const [gym, setGym] = useState<Gym | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let sub: ReturnType<typeof client.subscribe> | null = null;

    async function start() {
      try {
        await ensureLoggedIn();

        sub = client.subscribe('_gyms.info', gymId);
        await sub.ready();

        const gyms = client.collection('gyms').fetch({}) as Gym[];
        const found = gyms.find((g) => g.slug === gymId) ?? null;
        setGym(found);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    }

    start();
    return () => { sub?.stop(); };
  }, [gymId]);

  return { gym, loading };
}
