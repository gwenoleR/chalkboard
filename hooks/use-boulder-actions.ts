import { useCallback } from 'react';

import client, { ensureDDPConnected } from '@/lib/ddp/client';
import { useAuth } from '@/lib/auth/auth-context';

interface UseBoulderActions {
  /** Log a send (normal top). Removes any existing flash on the server. */
  logSend: (boulderId: string) => Promise<void>;
  /** Log a flash (topped on first attempt). */
  logFlash: (boulderId: string) => Promise<void>;
  /** Remove a previously logged send or flash. */
  removeSend: (boulderId: string) => Promise<void>;
  /** Like or unlike a boulder. Pass the current liked state so the correct method is called. */
  toggleLike: (boulderId: string, isLiked: boolean) => Promise<void>;
  /** Mark a boulder as a project. */
  addProject: (boulderId: string) => Promise<void>;
  /** Remove a boulder from projects. */
  removeProject: (boulderId: string) => Promise<void>;
  /** Post a text comment on a boulder. */
  saveComment: (boulderId: string, text: string) => Promise<void>;
  /** Delete a comment by its ID. */
  deleteComment: (commentId: string) => Promise<void>;
}

/**
 * Returns action callbacks for interacting with a boulder.
 * All methods require an authenticated session (userId non-null).
 * Throws if called while the user is a guest.
 *
 * Observed method signatures (captured from Social Boulder web app):
 *   _boulders.send      (boulderId, true, userId, false, false, false, false)
 *   _boulders.flash     (boulderId, userId, false, false)
 *   _boulders.notSend   (boulderId, true, userId, false)
 *   _boulders.project   (boulderId, userId, false, false)
 *   _boulders.notProject (boulderId)
 *   _boulders.like      (boulderId, userId, false, false)
 *   _boulders.notLike   (boulderId, userId, false, false)  ← unlike (tested, returns updated)
 *   _boulders.saveComment ({ text, boulderId, coach, fromHomescreen, uploadId })
 *   _boulders.deleteComment (commentId, false)
 */
export function useBoulderActions(): UseBoulderActions {
  const { userId } = useAuth();

  function requireAuth(): string {
    if (!userId) throw new Error('Must be logged in to perform this action');
    return userId;
  }

  const logSend = useCallback(async (boulderId: string) => {
    const uid = requireAuth();
    await ensureDDPConnected();
    await client.call('_boulders.send', boulderId, true, uid, false, false, false, false);
  }, [userId]);

  const logFlash = useCallback(async (boulderId: string) => {
    const uid = requireAuth();
    await ensureDDPConnected();
    await client.call('_boulders.flash', boulderId, uid, false, false);
  }, [userId]);

  const removeSend = useCallback(async (boulderId: string) => {
    const uid = requireAuth();
    await ensureDDPConnected();
    await client.call('_boulders.notSend', boulderId, true, uid, false);
  }, [userId]);

  const toggleLike = useCallback(async (boulderId: string, isLiked: boolean) => {
    const uid = requireAuth();
    await ensureDDPConnected();
    if (isLiked) {
      await client.call('_boulders.notLike', boulderId, uid, false, false);
    } else {
      await client.call('_boulders.like', boulderId, uid, false, false);
    }
  }, [userId]);

  const addProject = useCallback(async (boulderId: string) => {
    const uid = requireAuth();
    await ensureDDPConnected();
    await client.call('_boulders.project', boulderId, uid, false, false);
  }, [userId]);

  const removeProject = useCallback(async (boulderId: string) => {
    requireAuth();
    await ensureDDPConnected();
    await client.call('_boulders.notProject', boulderId);
  }, [userId]);

  const saveComment = useCallback(async (boulderId: string, text: string) => {
    requireAuth();
    await ensureDDPConnected();
    await client.call('_boulders.saveComment', {
      text,
      boulderId,
      coach: false,
      fromHomescreen: false,
      uploadId: null,
    });
  }, [userId]);

  const deleteComment = useCallback(async (commentId: string) => {
    requireAuth();
    await ensureDDPConnected();
    await client.call('_boulders.deleteComment', commentId, false);
  }, [userId]);

  return { logSend, logFlash, removeSend, toggleLike, addProject, removeProject, saveComment, deleteComment };
}

