import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { ReactionBatcher } from '../utils/batcher';

export interface FloatingEmoji {
  id: string;
  emoji: string;
  senderId: string;
  isOptimistic: boolean;
}

export function useEmojiReactions(
  roomId: Id<'rooms'> | undefined,
  identityId: string | null
) {
  const [reactions, setReactions] = useState<FloatingEmoji[]>([]);
  const sendBatch = useMutation(api.reactions.sendBatch);

  // Track IDs we've already added to our local 'reactions' state to avoid duplicates
  const seenIds = useRef<Set<string>>(new Set());

  // Subscribe to remote reactions
  const remoteReactionsRaw =
    useQuery(api.reactions.listRecent, roomId ? { roomId } : 'skip') || [];

  // Synchronize remote reactions into our local manageable state
  useEffect(() => {
    const newRemotes = remoteReactionsRaw.filter(
      (r) => r.identityId !== identityId && !seenIds.current.has(r._id)
    );

    if (newRemotes.length > 0) {
      const formatted: FloatingEmoji[] = newRemotes.map((r) => ({
        id: r._id,
        emoji: r.emoji,
        senderId: r.identityId,
        isOptimistic: false,
      }));

      // Mark as seen immediately
      formatted.forEach((r) => seenIds.current.add(r.id));

      // Add to state
      setReactions((prev) => [...prev, ...formatted]);

      // Schedule removal from state after 5 seconds
      formatted.forEach((r) => {
        setTimeout(() => {
          setReactions((current) => current.filter((c) => c.id !== r.id));
        }, 5000);
      });
    }
  }, [remoteReactionsRaw, identityId]);

  const batcher = useMemo(() => {
    return new ReactionBatcher((emojis) => {
      if (roomId && identityId) {
        sendBatch({ roomId, identityId, reactions: emojis }).catch(
          console.error
        );
      }
    }, 1000);
  }, [roomId, identityId, sendBatch]);

  const sendReaction = useCallback(
    (emoji: string) => {
      if (!identityId) return;

      // 1. Add to local state for immediate feedback
      const id = `${Date.now()}-${Math.random()}`;
      const newReaction: FloatingEmoji = {
        id,
        emoji,
        senderId: identityId,
        isOptimistic: true,
      };

      setReactions((prev) => [...prev, newReaction]);

      // 2. Add to batcher for Convex
      batcher.add(emoji);

      // 3. Remove from local state after 5 seconds
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== id));
      }, 5000);
    },
    [identityId, batcher]
  );

  return {
    localReactions: reactions,
    sendReaction,
  };
}
