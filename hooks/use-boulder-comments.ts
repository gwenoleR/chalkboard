import { useEffect, useState } from 'react';

import client, { ensureLoggedIn } from '@/lib/ddp/client';
import type { BoulderComment, BoulderCommentUserProfile } from '@/types/boulder';

interface UseBoulderComments {
  comments: BoulderComment[];
  loading: boolean;
  error: string | null;
}

/** Parses the Astronomy-serialised userProfile returned by the server. */
function parseUserProfile(raw: unknown): BoulderCommentUserProfile {
  try {
    const astronomy = raw as { $value?: { values?: string } };
    const values = astronomy?.$value?.values;
    if (values) return JSON.parse(values) as BoulderCommentUserProfile;
  } catch {
    // fall through
  }
  return { name: 'Unknown' };
}

/**
 * Subscribes to `_boulders.comments` for a single boulder.
 * Populates the `comments` collection with user posts (text + optional video).
 */
export function useBoulderComments(boulderId: string): UseBoulderComments {
  const [comments, setComments] = useState<BoulderComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!boulderId) return;

    let sub: ReturnType<typeof client.subscribe> | null = null;

    async function load() {
      try {
        await ensureLoggedIn();

        sub = client.subscribe('_boulders.comments', boulderId);
        await sub.ready();

        const raw = client.collection('comments').fetch({}) as Array<
          Record<string, unknown>
        >;

        const parsed: BoulderComment[] = raw
          .filter((item) => item.boulderId === boulderId)
          .map((item) => ({
          id: item.id as string,
          userId: item.userId as string,
          boulderId: item.boulderId as string,
          userProfile: parseUserProfile(item.userProfile),
          text: (item.text as string) ?? '',
          videoId: item.videoId as string | undefined,
          videoSource: item.videoSource as string | undefined,
          date: (item.date as { $date: number })?.$date
            ? new Date((item.date as { $date: number }).$date).toISOString()
            : (item.date as string),
          highlighted: item.highlighted as boolean | undefined,
        }));

        // Sort by date ascending
        parsed.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setComments(parsed);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error');
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => {
      sub?.remove();
    };
  }, [boulderId]);

  return { comments, loading, error };
}
