import { useEffect, useState } from 'react';

import client, { ensureDDPConnected } from '@/lib/ddp/client';
import type { Boulder } from '@/types/boulder';

interface UseUserSendsCountResult {
  count: number | null;
  loading: boolean;
}

const SORT = { isClosed: 1, createdAt: -1 };
const LIMIT = 500;

/**
 * Returns the total number of boulders sent by a user in a gym,
 * including closed/dismounted boulders.
 *
 * Uses `_boulders.list` with `{ gym, sentsList: userId }` and counts
 * results client-side. Avoids `counters-collection` whose single shared
 * document (`countBoulders`) gets overwritten when multiple gym stats
 * cards subscribe simultaneously.
 */
export function useUserSendsCount(gymSlug: string, userId: string | null): UseUserSendsCountResult {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setCount(null);
      setLoading(false);
      return;
    }

    let sub: ReturnType<typeof client.subscribe> | null = null;
    let cancelled = false;

    (async () => {
      await ensureDDPConnected();
      if (cancelled) return;

      sub = client.subscribe('_boulders.list', { gym: gymSlug, sentsList: userId }, SORT, LIMIT, null);
      await sub.ready();
      if (cancelled) return;

      // Filter client-side: gym + sentsList.includes(userId) to isolate
      // this user's boulders even when other subscriptions share the collection.
      const all = client.collection('boulders').fetch({}) as Boulder[];
      const sent = all.filter(
        (b) => b.gym === gymSlug && Array.isArray(b.sentsList) && b.sentsList.includes(userId)
      );
      setCount(sent.length);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, [gymSlug, userId]);

  return { count, loading };
}
