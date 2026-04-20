import { mutation } from './_generated/server';
import { v } from 'convex/values';

/**
 * Creates a short-lived, single-use sync token for an identity.
 * Valid for 2 minutes.
 */
export const create = mutation({
  args: { identityId: v.string() },
  handler: async (ctx, args) => {
    const expiresAt = Date.now() + 2 * 60 * 1000;
    // Generate a random 8-character token
    const token = Math.random().toString(36).substring(2, 10);

    await ctx.db.insert('sync_tokens', {
      token,
      identityId: args.identityId,
      expiresAt,
      isUsed: false,
    });

    return token;
  },
});

/**
 * Verifies a sync token and returns the associated identityId.
 * Marks the token as used upon successful verification.
 */
export const verify = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const syncToken = await ctx.db
      .query('sync_tokens')
      .withIndex('by_token', (q) => q.eq('token', args.token))
      .unique();

    if (!syncToken || syncToken.isUsed || Date.now() > syncToken.expiresAt) {
      throw new Error('Token already used or expired');
    }

    // Mark as used
    await ctx.db.patch(syncToken._id, { isUsed: true });

    return syncToken.identityId;
  },
});
