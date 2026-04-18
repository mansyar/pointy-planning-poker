import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { api } from './_generated/api';
import schema from './schema';
import * as rooms from './rooms';
import * as topics from './topics';
import * as apiModule from './_generated/api';
import * as serverModule from './_generated/server';

test('topics:add and topics:listByRoom', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    topics: async () => topics,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test-room',
    facilitatorId: 'user1',
  });

  // Add a topic
  await t.mutation(api.topics.add, {
    roomId,
    identityId: 'user1',
    title: 'First Topic',
  });

  // List topics
  const roomTopics = await t.query(api.topics.listByRoom, { roomId });
  expect(roomTopics.length).toBe(1);
  expect(roomTopics[0].title).toBe('First Topic');
  expect(roomTopics[0].status).toBe('pending');
  expect(roomTopics[0].order).toBe(1);

  // Add another topic
  await t.mutation(api.topics.add, {
    roomId,
    identityId: 'user1',
    title: 'Second Topic',
  });

  const roomTopics2 = await t.query(api.topics.listByRoom, { roomId });
  expect(roomTopics2.length).toBe(2);
  expect(roomTopics2[1].title).toBe('Second Topic');
  expect(roomTopics2[1].order).toBe(2);
});

test('topics:add is facilitator-only', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    topics: async () => topics,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test-room',
    facilitatorId: 'user1',
  });

  // Non-facilitator attempts to add
  await expect(
    t.mutation(api.topics.add, {
      roomId,
      identityId: 'user2',
      title: 'Hacker Topic',
    })
  ).rejects.toThrow('Only the facilitator can manage topics');
});

test('topics:remove', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    topics: async () => topics,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test-room',
    facilitatorId: 'user1',
  });

  await t.mutation(api.topics.add, {
    roomId,
    identityId: 'user1',
    title: 'Topic to Remove',
  });

  const roomTopics = await t.query(api.topics.listByRoom, { roomId });
  const topicId = roomTopics[0]._id;

  // Non-facilitator attempts to remove
  await expect(
    t.mutation(api.topics.remove, {
      topicId,
      identityId: 'user2',
    })
  ).rejects.toThrow('Only the facilitator can manage topics');

  // Facilitator removes
  await t.mutation(api.topics.remove, {
    topicId,
    identityId: 'user1',
  });

  const roomTopicsAfter = await t.query(api.topics.listByRoom, { roomId });
  expect(roomTopicsAfter.length).toBe(0);
});

test('topics:remove and reorder', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    topics: async () => topics,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test-room',
    facilitatorId: 'user1',
  });

  await t.mutation(api.topics.add, {
    roomId,
    identityId: 'user1',
    title: 'Topic 1',
  });
  await t.mutation(api.topics.add, {
    roomId,
    identityId: 'user1',
    title: 'Topic 2',
  });
  await t.mutation(api.topics.add, {
    roomId,
    identityId: 'user1',
    title: 'Topic 3',
  });

  const roomTopics = await t.query(api.topics.listByRoom, { roomId });
  const topic2Id = roomTopics[1]._id;

  // Remove middle topic
  await t.mutation(api.topics.remove, {
    topicId: topic2Id,
    identityId: 'user1',
  });

  const updatedTopics = await t.query(api.topics.listByRoom, { roomId });
  expect(updatedTopics.length).toBe(2);
  expect(updatedTopics[0].title).toBe('Topic 1');
  expect(updatedTopics[0].order).toBe(1);
  expect(updatedTopics[1].title).toBe('Topic 3');
  expect(updatedTopics[1].order).toBe(2);
});

test('topics:addBatch', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    topics: async () => topics,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test-room',
    facilitatorId: 'user1',
  });

  const titlesString = 'Topic A\nTopic B\nTopic C';
  await t.mutation(api.topics.addBatch, {
    roomId,
    identityId: 'user1',
    titlesString,
  });

  const roomTopics = await t.query(api.topics.listByRoom, { roomId });
  expect(roomTopics.length).toBe(3);
  expect(roomTopics[0].title).toBe('Topic A');
  expect(roomTopics[0].order).toBe(1);
  expect(roomTopics[1].title).toBe('Topic B');
  expect(roomTopics[1].order).toBe(2);
  expect(roomTopics[2].title).toBe('Topic C');
  expect(roomTopics[2].order).toBe(3);
});

test('topics:reorder', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    topics: async () => topics,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test-room',
    facilitatorId: 'user1',
  });

  await t.mutation(api.topics.addBatch, {
    roomId,
    identityId: 'user1',
    titlesString: 'T1\nT2\nT3',
  });

  const roomTopics = await t.query(api.topics.listByRoom, { roomId });
  const t1Id = roomTopics[0]._id;
  const t2Id = roomTopics[1]._id;
  const t3Id = roomTopics[2]._id;

  // Swap T1 and T2 (move T1 down)
  await t.mutation(api.topics.reorder, {
    topicId: t1Id,
    identityId: 'user1',
    newOrder: 2,
  });

  const updatedTopics = await t.query(api.topics.listByRoom, { roomId });
  // Should be T2, T1, T3
  expect(updatedTopics.find((t) => t._id === t2Id)?.order).toBe(1);
  expect(updatedTopics.find((t) => t._id === t1Id)?.order).toBe(2);
  expect(updatedTopics.find((t) => t._id === t3Id)?.order).toBe(3);

  // Move T3 to top
  await t.mutation(api.topics.reorder, {
    topicId: t3Id,
    identityId: 'user1',
    newOrder: 1,
  });

  const finalTopics = await t.query(api.topics.listByRoom, { roomId });
  // Should be T3, T2, T1
  expect(finalTopics.find((t) => t._id === t3Id)?.order).toBe(1);
  expect(finalTopics.find((t) => t._id === t2Id)?.order).toBe(2);
  expect(finalTopics.find((t) => t._id === t1Id)?.order).toBe(3);
});

test('topics:reorder edge cases', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    topics: async () => topics,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test-room',
    facilitatorId: 'user1',
  });

  await t.mutation(api.topics.add, {
    roomId,
    identityId: 'user1',
    title: 'T1',
  });

  const roomTopics = await t.query(api.topics.listByRoom, { roomId });
  const t1Id = roomTopics[0]._id;

  // Same order (should return early)
  await t.mutation(api.topics.reorder, {
    topicId: t1Id,
    identityId: 'user1',
    newOrder: 1,
  });

  // Invalid order
  await expect(
    t.mutation(api.topics.reorder, {
      topicId: t1Id,
      identityId: 'user1',
      newOrder: 0,
    })
  ).rejects.toThrow('Invalid order');

  await expect(
    t.mutation(api.topics.reorder, {
      topicId: t1Id,
      identityId: 'user1',
      newOrder: 2,
    })
  ).rejects.toThrow('Invalid order');
});

test('topics:setFinalEstimate', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    topics: async () => topics,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const roomId = await t.mutation(api.rooms.create, {
    slug: 'test-room',
    facilitatorId: 'user1',
  });

  await t.mutation(api.topics.add, {
    roomId,
    identityId: 'user1',
    title: 'Topic',
  });

  const roomTopics = await t.query(api.topics.listByRoom, { roomId });
  const topicId = roomTopics[0]._id;

  await t.mutation(api.topics.setFinalEstimate, {
    topicId,
    identityId: 'user1',
    estimate: '8',
  });

  const updatedTopic = await t.run(async (ctx) => await ctx.db.get(topicId));
  expect(updatedTopic?.finalEstimate).toBe('8');
});
