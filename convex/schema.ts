import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  rooms: defineTable({
    slug: v.string(),
    status: v.union(v.literal('voting'), v.literal('revealed')),
    facilitatorId: v.string(), // identityId of current facilitator
    currentTopicId: v.optional(v.id('topics')),
    timerStartedAt: v.optional(v.number()),
    autoReveal: v.optional(v.boolean()), // if true, reveal once everyone has voted
    scaleType: v.optional(v.union(v.literal('fibonacci'), v.literal('tshirt'))),
    toolType: v.optional(v.union(v.literal('poker'), v.literal('standup'))),
    standupTimeLimit: v.optional(v.number()), // in seconds
    standupAutoAdvance: v.optional(v.boolean()),
    standupGracePeriod: v.optional(v.number()), // in seconds
    updatedAt: v.number(),
  })
    .index('by_slug', ['slug'])
    .index('by_updated', ['updatedAt']),

  players: defineTable({
    roomId: v.id('rooms'),
    identityId: v.string(), // Unique per browser (from localStorage)
    name: v.string(),
    isOnline: v.boolean(),
    lastHeartbeat: v.number(),
    lastNudgedAt: v.optional(v.number()),
  })
    .index('by_room', ['roomId'])
    .index('by_identity', ['roomId', 'identityId'])
    .index('by_online', ['roomId', 'isOnline']),

  votes: defineTable({
    roomId: v.id('rooms'),
    topicId: v.optional(v.id('topics')),
    identityId: v.string(),
    value: v.union(v.string(), v.number(), v.null()),
  })
    .index('by_room', ['roomId'])
    .index('by_voter', ['roomId', 'identityId', 'topicId'])
    .index('by_topic', ['roomId', 'topicId']),

  topics: defineTable({
    roomId: v.id('rooms'),
    title: v.string(),
    order: v.number(),
    status: v.union(
      v.literal('pending'),
      v.literal('active'),
      v.literal('completed')
    ),
    finalEstimate: v.optional(v.string()),
  })
    .index('by_room', ['roomId'])
    .index('by_status', ['roomId', 'status']),

  reactions: defineTable({
    roomId: v.id('rooms'),
    identityId: v.string(),
    emoji: v.string(),
    createdAt: v.number(),
  })
    .index('by_room', ['roomId'])
    .index('by_room_and_time', ['roomId', 'createdAt']),

  sync_tokens: defineTable({
    token: v.string(),
    identityId: v.string(),
    expiresAt: v.number(),
    isUsed: v.boolean(),
  }).index('by_token', ['token']),

  standup_entries: defineTable({
    roomId: v.id('rooms'),
    identityId: v.string(),
    order: v.number(),
    status: v.union(
      v.literal('pending'),
      v.literal('speaking'),
      v.literal('completed'),
      v.literal('skipped')
    ),
    duration: v.optional(v.number()), // total seconds spent speaking
    startedAt: v.optional(v.number()), // timestamp when current turn started
  }).index('by_room', ['roomId']),

  parking_lot: defineTable({
    roomId: v.id('rooms'),
    identityId: v.string(),
    text: v.string(),
    createdAt: v.number(),
  }).index('by_room', ['roomId']),
});
