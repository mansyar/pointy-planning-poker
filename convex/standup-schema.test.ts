import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import schema from './schema';
import * as apiModule from './_generated/api';
import * as serverModule from './_generated/server';

test('schema includes standup_entries and parking_lot', async () => {
  const t = convexTest(schema, {
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  await t.run(async (ctx) => {
    // These should fail if schema is not updated
    const roomId = await ctx.db.insert('rooms', {
      slug: 'standup-test',
      status: 'voting',
      facilitatorId: 'user1',
      updatedAt: Date.now(),
      toolType: 'standup',
    });

    const entryId = await ctx.db.insert('standup_entries', {
      roomId,
      identityId: 'user1',
      order: 0,
      status: 'pending',
    });
    expect(entryId).toBeDefined();

    const parkingId = await ctx.db.insert('parking_lot', {
      roomId,
      identityId: 'user1',
      text: 'Need to discuss CI/CD',
      createdAt: Date.now(),
    });
    expect(parkingId).toBeDefined();
  });
});
