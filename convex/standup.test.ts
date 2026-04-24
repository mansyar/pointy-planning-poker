import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { api } from './_generated/api';
import schema from './schema';
import * as rooms from './rooms';
import * as players from './players';
import * as standup from './standup';
import * as apiModule from './_generated/api';
import * as serverModule from './_generated/server';

test('standup.start populates queue and starts first speaker', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    players: async () => players,
    standup: async () => standup,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const { roomId } = await t.mutation(api.rooms.create, {
    slug: 'standup-test',
    facilitatorId: 'fac-1',
  });

  // Join some players
  await t.mutation(api.players.join, { roomId, identityId: 'fac-1', name: 'Facilitator' });
  await t.mutation(api.players.join, { roomId, identityId: 'user-2', name: 'User 2' });
  await t.mutation(api.players.join, { roomId, identityId: 'user-3', name: 'User 3' });

  // Start standup
  await t.mutation(api.standup.start, {
    roomId,
    identityId: 'fac-1',
    config: {
      timeLimit: 60,
      autoAdvance: true,
      gracePeriod: 5,
    }
  });

  const entries = await t.run(async (ctx) => {
    return await ctx.db
      .query('standup_entries')
      .withIndex('by_room', (q) => q.eq('roomId', roomId))
      .collect();
  });

  expect(entries.length).toBe(3);
  const speakingEntry = entries.find(e => e.status === 'speaking');
  expect(speakingEntry).toBeDefined();
  expect(speakingEntry?.startedAt).toBeDefined();
  
  const room = await t.run(async (ctx) => await ctx.db.get(roomId));
  expect(room?.standupTimeLimit).toBe(60);
  expect(room?.standupAutoAdvance).toBe(true);
  expect(room?.toolType).toBe('standup');
});

test('standup.start without config', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    players: async () => players,
    standup: async () => standup,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const { roomId } = await t.mutation(api.rooms.create, {
    slug: 'standup-test-no-config',
    facilitatorId: 'fac-1',
  });

  await t.mutation(api.players.join, { roomId, identityId: 'fac-1', name: 'Facilitator' });

  await t.mutation(api.standup.start, {
    roomId,
    identityId: 'fac-1',
  });

  const room = await t.run(async (ctx) => await ctx.db.get(roomId));
  expect(room?.toolType).toBe('standup');
  expect(room?.standupTimeLimit).toBeUndefined();
});

test('standup.start clears existing entries', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    players: async () => players,
    standup: async () => standup,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const { roomId } = await t.mutation(api.rooms.create, {
    slug: 'standup-test-clear',
    facilitatorId: 'fac-1',
  });

  await t.mutation(api.players.join, { roomId, identityId: 'fac-1', name: 'Facilitator' });

  // Start once
  await t.mutation(api.standup.start, { roomId, identityId: 'fac-1' });

  // Start again
  await t.mutation(api.standup.start, { roomId, identityId: 'fac-1' });

  const entries = await t.query(api.standup.listEntries, { roomId });
  expect(entries.length).toBe(1);
});

test('standup.listEntries sorts by order', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    players: async () => players,
    standup: async () => standup,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const { roomId } = await t.mutation(api.rooms.create, {
    slug: 'standup-test-sort',
    facilitatorId: 'fac-1',
  });

  await t.mutation(api.players.join, { roomId, identityId: 'fac-1', name: 'Facilitator' });
  await t.mutation(api.players.join, { roomId, identityId: 'user-b', name: 'Bob' });
  await t.mutation(api.players.join, { roomId, identityId: 'user-a', name: 'Alice' });

  await t.mutation(api.standup.start, { roomId, identityId: 'fac-1' });

  const entries = await t.query(api.standup.listEntries, { roomId });
  expect(entries[0].identityId).toBe('user-a'); // Alice (Starts with A)
  expect(entries[1].identityId).toBe('user-b'); // Bob (Starts with B)
  expect(entries[2].identityId).toBe('fac-1'); // Facilitator (Starts with F)
});

test('standup.next advances speaker and records duration', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    players: async () => players,
    standup: async () => standup,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const { roomId } = await t.mutation(api.rooms.create, {
    slug: 'next-test',
    facilitatorId: 'fac-1',
  });

  await t.mutation(api.players.join, { roomId, identityId: 'fac-1', name: 'Facilitator' });
  await t.mutation(api.players.join, { roomId, identityId: 'user-2', name: 'User 2' });

  await t.mutation(api.standup.start, { roomId, identityId: 'fac-1' });

  // Mock time advancement
  vi.setSystemTime(Date.now() + 10000); // 10s passed

  await t.mutation(api.standup.next, { roomId, identityId: 'fac-1' });

  const entries = await t.query(api.standup.listEntries, { roomId });
  const first = entries.find(e => e.order === 0);
  const second = entries.find(e => e.order === 1);

  expect(first?.status).toBe('completed');
  expect(first?.duration).toBeGreaterThanOrEqual(10);
  expect(second?.status).toBe('speaking');
  expect(second?.startedAt).toBeDefined();
});

test('standup.previous returns to previous speaker', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    players: async () => players,
    standup: async () => standup,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const { roomId } = await t.mutation(api.rooms.create, {
    slug: 'prev-test',
    facilitatorId: 'fac-1',
  });

  await t.mutation(api.players.join, { roomId, identityId: 'fac-1', name: 'Facilitator' });
  await t.mutation(api.players.join, { roomId, identityId: 'user-2', name: 'User 2' });

  await t.mutation(api.standup.start, { roomId, identityId: 'fac-1' });
  await t.mutation(api.standup.next, { roomId, identityId: 'fac-1' });

  await t.mutation(api.standup.previous, { roomId, identityId: 'fac-1' });

  const entries = await t.query(api.standup.listEntries, { roomId });
  const first = entries.find(e => e.order === 0);
  const second = entries.find(e => e.order === 1);

  expect(first?.status).toBe('speaking');
  expect(second?.status).toBe('pending');
});

test('standup.previous fallback when no one is speaking', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    players: async () => players,
    standup: async () => standup,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const { roomId } = await t.mutation(api.rooms.create, {
    slug: 'prev-fallback-test',
    facilitatorId: 'fac-1',
  });

  await t.mutation(api.players.join, { roomId, identityId: 'fac-1', name: 'Facilitator' });
  await t.mutation(api.players.join, { roomId, identityId: 'user-2', name: 'User 2' });

  await t.mutation(api.standup.start, { roomId, identityId: 'fac-1' });
  await t.mutation(api.standup.next, { roomId, identityId: 'fac-1' });
  await t.mutation(api.standup.next, { roomId, identityId: 'fac-1' });

  // Now no one is speaking (all completed)
  const entriesBefore = await t.query(api.standup.listEntries, { roomId });
  expect(entriesBefore.every(e => e.status === 'completed')).toBe(true);

  await t.mutation(api.standup.previous, { roomId, identityId: 'fac-1' });

  const entriesAfter = await t.query(api.standup.listEntries, { roomId });
  const last = entriesAfter.find(e => e.order === 1);
  expect(last?.status).toBe('speaking');
});

test('standup.skip skips current speaker', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    players: async () => players,
    standup: async () => standup,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const { roomId } = await t.mutation(api.rooms.create, {
    slug: 'skip-test',
    facilitatorId: 'fac-1',
  });

  await t.mutation(api.players.join, { roomId, identityId: 'fac-1', name: 'Facilitator' });
  await t.mutation(api.players.join, { roomId, identityId: 'user-2', name: 'User 2' });

  await t.mutation(api.standup.start, { roomId, identityId: 'fac-1' });
  await t.mutation(api.standup.skip, { roomId, identityId: 'fac-1' });

  const entries = await t.query(api.standup.listEntries, { roomId });
  const first = entries.find(e => e.order === 0);
  const second = entries.find(e => e.order === 1);

  expect(first?.status).toBe('skipped');
  expect(second?.status).toBe('speaking');
});

test('standup mutations are facilitator-only', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    standup: async () => standup,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const { roomId } = await t.mutation(api.rooms.create, {
    slug: 'fac-only-test',
    facilitatorId: 'fac-1',
  });

  await expect(t.mutation(api.standup.next, { roomId, identityId: 'user-2' })).rejects.toThrow();
  await expect(t.mutation(api.standup.previous, { roomId, identityId: 'user-2' })).rejects.toThrow();
  await expect(t.mutation(api.standup.skip, { roomId, identityId: 'user-2' })).rejects.toThrow();
});

test('standup.start requires facilitator', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    standup: async () => standup,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const { roomId } = await t.mutation(api.rooms.create, {
    slug: 'standup-test-2',
    facilitatorId: 'fac-1',
  });

  await expect(
    t.mutation(api.standup.start, {
      roomId,
      identityId: 'user-2',
    })
  ).rejects.toThrow('Only the facilitator can start the standup');
});
