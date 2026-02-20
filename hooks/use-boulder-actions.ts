import { useCallback } from 'react';

import client, { ensureLoggedIn } from '@/lib/ddp/client';

const USER_ID = process.env.EXPO_PUBLIC_DDP_USER_ID!;

interface UseBoulderActions {
  /** Log a send (normal top). Removes any existing flash on the server. */
  logSend: (boulderId: string) => Promise<void>;
  /** Log a flash (topped on first attempt). */
  logFlash: (boulderId: string) => Promise<void>;
  /** Remove a previously logged send or flash. */
  removeSend: (boulderId: string) => Promise<void>;
  /** Toggle the like on a boulder. */
  toggleLike: (boulderId: string) => Promise<void>;
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
 * All methods ensure login before calling the DDP server.
 *
 * Observed method signatures (captured from Social Boulder web app):
 *   _boulders.send      (boulderId, true, userId, false, false, false, false)
 *   _boulders.flash     (boulderId, userId, false, false)
 *   _boulders.notSend   (boulderId, true, userId, false)
 *   _boulders.project   (boulderId, userId, false, false)
 *   _boulders.notProject (boulderId)
 *   _boulders.like      (boulderId, userId, false, false)
 *   _boulders.saveComment ({ text, boulderId, coach, fromHomescreen, uploadId })
 *   _boulders.deleteComment (commentId, false)
 */
export function useBoulderActions(): UseBoulderActions {
  const logSend = useCallback(async (boulderId: string) => {
    await ensureLoggedIn();
    await client.call('_boulders.send', boulderId, true, USER_ID, false, false, false, false);
  }, []);

  const logFlash = useCallback(async (boulderId: string) => {
    await ensureLoggedIn();
    await client.call('_boulders.flash', boulderId, USER_ID, false, false);
  }, []);

  const removeSend = useCallback(async (boulderId: string) => {
    await ensureLoggedIn();
    await client.call('_boulders.notSend', boulderId, true, USER_ID, false);
  }, []);

  const toggleLike = useCallback(async (boulderId: string) => {
    await ensureLoggedIn();
    await client.call('_boulders.like', boulderId, USER_ID, false, false);
  }, []);

  const addProject = useCallback(async (boulderId: string) => {
    await ensureLoggedIn();
    await client.call('_boulders.project', boulderId, USER_ID, false, false);
  }, []);

  const removeProject = useCallback(async (boulderId: string) => {
    await ensureLoggedIn();
    await client.call('_boulders.notProject', boulderId);
  }, []);

  const saveComment = useCallback(async (boulderId: string, text: string) => {
    await ensureLoggedIn();
    await client.call('_boulders.saveComment', {
      text,
      boulderId,
      coach: false,
      fromHomescreen: false,
      uploadId: null,
    });
  }, []);

  const deleteComment = useCallback(async (commentId: string) => {
    await ensureLoggedIn();
    await client.call('_boulders.deleteComment', commentId, false);
  }, []);

  return { logSend, logFlash, removeSend, toggleLike, addProject, removeProject, saveComment, deleteComment };
}
