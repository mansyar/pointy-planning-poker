import { mutation } from './_generated/server';

/**
 * Backfills existing rooms with toolType: 'poker' if missing.
 */
export const backfillToolType = mutation({
  args: {},
  handler: async (ctx) => {
    const rooms = await ctx.db.query('rooms').collect();
    let count = 0;
    for (const room of rooms) {
      if (room.toolType === undefined) {
        await ctx.db.patch(room._id, {
          toolType: 'poker',
        });
        count++;
      }
    }
    return { count };
  },
});
