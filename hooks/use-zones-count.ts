import { useCallback, useEffect, useState } from 'react';

import client, { ensureDDPConnected } from '@/lib/ddp/client';

/** Zone ID → number of boulders matching the query in that zone. */
export type ZonesCount = Record<string, number>;

interface UseZonesCount {
  counts: ZonesCount | null;
  loading: boolean;
  error: string | null;
  /** Re-fetch manually (e.g. after logging a send). */
  refresh: () => void;
}

/**
 * Calls `_boulders.getZonesCount` with a boulder selector and returns the
 * per-zone count. Typical selectors:
 *   { gym, sentsList: userId, isClosed: null }    → sends per zone
 *   { gym, flashesList: userId, isClosed: null }  → flashes per zone
 *   { gym, projectsList: userId, isClosed: null } → projects per zone
 *   { gym, isClosed: null }                       → all open boulders per zone
 */
export function useZonesCount(selector: Record<string, unknown>): UseZonesCount {
  const [counts, setCounts] = useState<ZonesCount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  // Stable cache key — re-fetch only when the selector changes
  const selectorKey = JSON.stringify(selector);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        await ensureDDPConnected();
        const result = await client.call('_boulders.getZonesCount', selector);
        if (!cancelled) setCounts(result as ZonesCount);
      } catch (e: unknown) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectorKey, tick]);

  return { counts, loading, error, refresh };
}
