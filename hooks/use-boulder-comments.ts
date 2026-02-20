import { useEffect, useState } from 'react';

import client, { ensureLoggedIn } from '@/lib/ddp/client';
import type { BoulderComment, BoulderCommentUserProfile, DdpDateLike } from '@/types/boulder';
import { ddpDateToDate } from '@/types/boulder';

interface UseBoulderComments {
  comments: BoulderComment[];
  loading: boolean;
  error: string | null;
}

/**
 * Parses the Astronomy-serialised userProfile returned by the server.
 * After EJSON.addType('Astronomy') is registered, simpleddp stores the $value
 * directly: { class: "UserProfile", values: "{...JSON...}" }.
 * Also handles the pre-fix raw format as fallback.
 */
function parseUserProfile(raw: unknown): BoulderCommentUserProfile {
  try {
    // Post-fix: EJSON passthrough returns the $value directly
    const obj = raw as { values?: string; class?: string };
    if (obj?.values) return JSON.parse(obj.values) as BoulderCommentUserProfile;

    // Pre-fix fallback: raw Astronomy object with $value wrapper
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
 *
 * Note: requires EJSON.addType('Astronomy') to be registered (done in lib/ddp/client.ts)
 * otherwise simpleddp-core silently drops comment messages containing Astronomy-serialised
 * userProfile objects.
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
          date: ddpDateToDate(item.date as DdpDateLike)?.toISOString() ?? new Date(0).toISOString(),
          highlighted: item.highlighted as boolean | undefined,
        }));

        // For comments with videos, subscribe to _videos.details to resolve playbackId
        const videoComments = parsed.filter((c) => c.videoId);
        if (videoComments.length > 0) {
          const videoSubs = videoComments.map((c) =>
            client.subscribe('_videos.details', c.videoId)
          );
          await Promise.all(videoSubs.map((s) => s.ready()));

          const videos = client.collection('videos').fetch({}) as Array<
            Record<string, unknown>
          >;
          const playbackMap = new Map<string, string>();
          videos.forEach((v) => {
            if (v.uploadId && v.playbackId) {
              playbackMap.set(v.uploadId as string, v.playbackId as string);
            }
          });

          parsed.forEach((c) => {
            if (c.videoId) c.playbackId = playbackMap.get(c.videoId);
          });
        }

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
