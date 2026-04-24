import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const add = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('parking_lot', {
      roomId: args.roomId,
      identityId: args.identityId,
      text: args.text,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id('parking_lot'),
    identityId: v.string(),
  },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) return;

    await ctx.db.delete(args.id);
  },
});

export const listByRoom = query({
  args: { roomId: v.id('rooms') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('parking_lot')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .order('asc')
      .collect();
  },
});
