import { convexTest } from 'convex-test';
import { expect, test } from 'vitest';
import { api } from './_generated/api';
import schema from './schema';
import * as rooms from './rooms';
import * as parkingLot from './parkingLot';
import * as apiModule from './_generated/api';
import * as serverModule from './_generated/server';

test('parkingLot operations', async () => {
  const t = convexTest(schema, {
    rooms: async () => rooms,
    parkingLot: async () => parkingLot,
    '_generated/api': async () => apiModule,
    '_generated/server': async () => serverModule,
  });

  const { roomId } = await t.mutation(api.rooms.create, {
    slug: 'parking-test',
    facilitatorId: 'user1',
  });

  // Add items
  await t.mutation(api.parkingLot.add, {
    roomId,
    identityId: 'user1',
    text: 'Item 1',
  });
  await t.mutation(api.parkingLot.add, {
    roomId,
    identityId: 'user2',
    text: 'Item 2',
  });

  // List items
  const items = await t.query(api.parkingLot.listByRoom, { roomId });
  expect(items.length).toBe(2);
  expect(items[0].text).toBe('Item 1');
  expect(items[1].text).toBe('Item 2');

  // Remove item
  await t.mutation(api.parkingLot.remove, {
    id: items[0]._id,
    identityId: 'user1',
  });

  const remainingItems = await t.query(api.parkingLot.listByRoom, { roomId });
  expect(remainingItems.length).toBe(1);
  expect(remainingItems[0].text).toBe('Item 2');
});
