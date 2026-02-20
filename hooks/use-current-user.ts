import { useEffect, useState } from 'react';

import client, { ensureDDPConnected } from '@/lib/ddp/client';
import { useAuth } from '@/lib/auth/auth-context';
import type { User } from '@/types/user';

interface UseCurrentUserResult {
  user: User | null;
  loading: boolean;
}

/**
 * Subscribes to the current user's profile via `users.single`.
 * Returns null for guests (no userId).
 */
export function useCurrentUser(): UseCurrentUserResult {
  const { userId } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    let sub: ReturnType<typeof client.subscribe> | null = null;
    let cancelled = false;

    (async () => {
      await ensureDDPConnected();
      if (cancelled) return;

      sub = client.subscribe('users.single', userId);
      await sub.ready();
      if (cancelled) return;

      const allUsers = client.collection('users').fetch({}) as User[];
      const raw = allUsers.find((u) => u.id === userId) ?? null;
      setUser(raw);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, [userId]);

  return { user, loading };
}
