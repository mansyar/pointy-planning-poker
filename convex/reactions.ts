import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const send = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('reactions', {
      roomId: args.roomId,
      identityId: args.identityId,
      emoji: args.emoji,
      createdAt: Date.now(),
    });
  },
});

export const sendBatch = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
    reactions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    for (const emoji of args.reactions) {
      await ctx.db.insert('reactions', {
        roomId: args.roomId,
        identityId: args.identityId,
        emoji,
        createdAt: now,
      });
    }
  },
});

export const listRecent = query({
  args: {
    roomId: v.id('rooms'),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const fiveSecondsAgo = now - 5000;

    return await ctx.db
      .query('reactions')
      .withIndex('by_room_and_time', (q) =>
        q.eq('roomId', args.roomId).gt('createdAt', fiveSecondsAgo)
      )
      .collect();
  },
});
