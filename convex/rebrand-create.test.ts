import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { api } from './_generated/api';
import schema from './schema';
import * as rooms from './rooms';
import * as apiModule from './_generated/api';
import * as serverModule from './_generated/server';

test('rooms.create sets toolType', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  // 1. Create with explicit toolType
  const { roomId: id1 } = await t.mutation(api.rooms.create, {
    facilitatorId: 'user1',
    toolType: 'poker',
  });

  const room1 = await t.run(async (ctx) => await ctx.db.get(id1));
  expect(room1?.toolType).toBe('poker');

  // 2. Create without toolType (should default to poker)
  const { roomId: id2 } = await t.mutation(api.rooms.create, {
    facilitatorId: 'user2',
  });

  const room2 = await t.run(async (ctx) => await ctx.db.get(id2));
  expect(room2?.toolType).toBe('poker');
});
