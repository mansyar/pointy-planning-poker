import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const start = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
    config: v.optional(
      v.object({
        timeLimit: v.optional(v.number()),
        autoAdvance: v.optional(v.boolean()),
        gracePeriod: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error('Room not found');

    if (room.facilitatorId !== args.identityId) {
      throw new Error('Only the facilitator can start the standup');
    }

    // 1. Update room configuration
    if (args.config) {
      await ctx.db.patch(args.roomId, {
        standupTimeLimit: args.config.timeLimit ?? room.standupTimeLimit,
        standupAutoAdvance: args.config.autoAdvance ?? room.standupAutoAdvance,
        standupGracePeriod: args.config.gracePeriod ?? room.standupGracePeriod,
        toolType: 'standup',
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.patch(args.roomId, {
        toolType: 'standup',
        updatedAt: Date.now(),
      });
    }

    // 2. Clear existing standup entries
    const existingEntries = await ctx.db
      .query('standup_entries')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();

    for (const entry of existingEntries) {
      await ctx.db.delete(entry._id);
    }

    // 3. Get all online players
    const players = await ctx.db
      .query('players')
      .withIndex('by_online', (q) => q.eq('roomId', args.roomId).eq('isOnline', true))
      .collect();

    // 4. Create new standup entries
    // For now, use name alphabetical for default.
    const sortedPlayers = players.sort((a, b) => a.name.localeCompare(b.name));

    for (let i = 0; i < sortedPlayers.length; i++) {
      const player = sortedPlayers[i];
      await ctx.db.insert('standup_entries', {
        roomId: args.roomId,
        identityId: player.identityId,
        order: i,
        status: i === 0 ? 'speaking' : 'pending',
        startedAt: i === 0 ? Date.now() : undefined,
      });
    }
  },
});

export const listEntries = query({
  args: { roomId: v.id('rooms') },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query('standup_entries')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();
    return entries.sort((a, b) => a.order - b.order);
  },
});
