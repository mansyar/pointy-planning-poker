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

export const next = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error('Room not found');
    if (room.facilitatorId !== args.identityId) {
      throw new Error('Only the facilitator can advance the standup');
    }

    const entries = await ctx.db
      .query('standup_entries')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();

    const currentEntry = entries.find((e) => e.status === 'speaking');
    if (!currentEntry) return;

    // 1. Mark current as completed
    const duration = currentEntry.startedAt
      ? Math.floor((Date.now() - currentEntry.startedAt) / 1000)
      : 0;

    await ctx.db.patch(currentEntry._id, {
      status: 'completed',
      duration: (currentEntry.duration ?? 0) + duration,
      startedAt: undefined,
    });

    // 2. Find next pending
    const nextEntry = entries
      .filter((e) => e.status === 'pending')
      .sort((a, b) => a.order - b.order)[0];

    if (nextEntry) {
      await ctx.db.patch(nextEntry._id, {
        status: 'speaking',
        startedAt: Date.now(),
      });
    }
  },
});

export const previous = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error('Room not found');
    if (room.facilitatorId !== args.identityId) {
      throw new Error('Only the facilitator can go back in the standup');
    }

    const entries = await ctx.db
      .query('standup_entries')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();

    const currentEntry = entries.find((e) => e.status === 'speaking');

    if (currentEntry) {
      // 1. Current becomes pending
      await ctx.db.patch(currentEntry._id, {
        status: 'pending',
        startedAt: undefined,
      });

      // 2. Previous completed becomes speaking
      const prevEntry = entries
        .filter((e) => e.status === 'completed' || e.status === 'skipped')
        .sort((a, b) => b.order - a.order)[0]; // Latest completed

      if (prevEntry) {
        await ctx.db.patch(prevEntry._id, {
          status: 'speaking',
          startedAt: Date.now(),
        });
      }
    } else {
      // If no one is speaking, maybe we finished?
      // Find the last completed one.
      const lastEntry = entries
        .filter((e) => e.status === 'completed' || e.status === 'skipped')
        .sort((a, b) => b.order - a.order)[0];

      if (lastEntry) {
        await ctx.db.patch(lastEntry._id, {
          status: 'speaking',
          startedAt: Date.now(),
        });
      }
    }
  },
});

export const skip = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error('Room not found');
    if (room.facilitatorId !== args.identityId) {
      throw new Error('Only the facilitator can skip speakers');
    }

    const entries = await ctx.db
      .query('standup_entries')
      .withIndex('by_room', (q) => q.eq('roomId', args.roomId))
      .collect();

    const currentEntry = entries.find((e) => e.status === 'speaking');
    if (!currentEntry) return;

    // 1. Mark current as skipped
    await ctx.db.patch(currentEntry._id, {
      status: 'skipped',
      startedAt: undefined,
    });

    // 2. Find next pending
    const nextEntry = entries
      .filter((e) => e.status === 'pending')
      .sort((a, b) => a.order - b.order)[0];

    if (nextEntry) {
      await ctx.db.patch(nextEntry._id, {
        status: 'speaking',
        startedAt: Date.now(),
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

export const updateConfig = mutation({
  args: {
    roomId: v.id('rooms'),
    identityId: v.string(),
    config: v.object({
      timeLimit: v.optional(v.number()),
      autoAdvance: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error('Room not found');
    if (room.facilitatorId !== args.identityId) {
      throw new Error('Only the facilitator can update standup settings');
    }

    await ctx.db.patch(args.roomId, {
      standupTimeLimit: args.config.timeLimit ?? room.standupTimeLimit,
      standupAutoAdvance: args.config.autoAdvance ?? room.standupAutoAdvance,
      updatedAt: Date.now(),
    });
  },
});
