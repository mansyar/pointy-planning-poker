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
