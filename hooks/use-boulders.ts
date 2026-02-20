import { useCallback, useEffect, useState } from 'react';

import client, { ensureDDPConnected } from '@/lib/ddp/client';
import type { Boulder } from '@/types/boulder';

const LIMIT = 200;
const SORT = { isClosed: 1, createdAt: -1, boulderNum: -1, label: -1, holdsColor: -1 };

interface UseBoulders {
  boulders: Boulder[];
  count: number | null;
  loading: boolean;
  error: string | null;
  /** Re-reads the collection from the DDP client. Call on screen focus to pick up changes made in the detail screen. */
  refresh: () => void;
}

/**
 * Subscribes to the boulder list and count for the given gym.
 * Reactively fetches active boulders (isClosed: null) sorted by recency.
 */
export function useBoulders(gymId: string): UseBoulders {
  const [boulders, setBoulders] = useState<Boulder[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    const raw = client.collection('boulders').fetch({}) as Boulder[];
    if (raw.length > 0) setBoulders(raw);
  }, []);

  useEffect(() => {
    let subList: ReturnType<typeof client.subscribe> | null = null;
    let subCount: ReturnType<typeof client.subscribe> | null = null;

    const selector = { gym: gymId, isClosed: null };

    async function start() {
      try {
        await ensureDDPConnected();

        subCount = client.subscribe('_boulders.count', selector);
        subList = client.subscribe('_boulders.list', selector, SORT, LIMIT, null);

        // Fast path: collection data survives fast-refresh (client is on global).
        // Render immediately with cached data while subscriptions re-establish.
        const cached = client.collection('boulders').fetch({}) as Boulder[];
        if (cached.length > 0) {
          setBoulders(cached);
          const cachedCounters = client.collection('counters-collection').fetch({}) as {
            count: number;
          }[];
          if (cachedCounters.length > 0) setCount(cachedCounters[0].count);
          setLoading(false);
        }

        await Promise.all([subCount.ready(), subList.ready()]);

        const raw = client.collection('boulders').fetch({}) as Boulder[];
        setBoulders(raw);

        const counters = client.collection('counters-collection').fetch({}) as { count: number }[];
        if (counters.length > 0) setCount(counters[0].count);

        setLoading(false);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'DDP error');
        setLoading(false);
      }
    }

    start();

    return () => {
      subList?.remove();
      subCount?.remove();
    };
  }, [gymId]);

  return { boulders, count, loading, error, refresh };
}
