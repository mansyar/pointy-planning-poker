import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { api } from './_generated/api';
import schema from './schema';
import * as sync from './sync';
import * as apiModule from './_generated/api';
import * as serverModule from './_generated/server';

test('sync:create and sync:verify flow', async () => {
  const t = convexTest(schema, {
    sync: async () => sync,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const identityId = 'user-123';

  // 1. Create a sync token
  const token = await t.mutation(api.sync.create, { identityId });
  expect(token).toBeDefined();
  expect(typeof token).toBe('string');

  // 2. Verify the token
  const verifiedIdentityId = await t.mutation(api.sync.verify, { token });
  expect(verifiedIdentityId).toBe(identityId);

  // 3. Try to verify the same token again (should fail - single-use)
  await expect(t.mutation(api.sync.verify, { token })).rejects.toThrow(
    'Token already used or expired'
  );
});

test('sync:verify fails for expired tokens', async () => {
  const t = convexTest(schema, {
    sync: async () => sync,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const identityId = 'user-123';

  // Create token
  const token = await t.mutation(api.sync.create, { identityId });

  // Manually expire the token
  await t.run(async (ctx) => {
    const syncToken = await ctx.db
      .query('sync_tokens')
      .withIndex('by_token', (q) => q.eq('token', token))
      .unique();
    if (syncToken) {
      await ctx.db.patch(syncToken._id, { expiresAt: Date.now() - 1000 });
    }
  });

  // Try to verify (should fail)
  await expect(t.mutation(api.sync.verify, { token })).rejects.toThrow(
    'Token already used or expired'
  );
});
