import { render, screen } from '@testing-library/react';
import { TopicSidebar } from '../src/components/TopicSidebar';
import { describe, it, expect, vi } from 'vitest';
import { useQuery } from 'convex/react';
import type { Id } from '../convex/_generated/dataModel';

vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

describe('TopicSidebar', () => {
  it('renders a list of pending and completed topics', () => {
    vi.mocked(useQuery).mockReturnValue([
      {
        _id: '1' as Id<'topics'>,
        title: 'Pending Topic',
        order: 1,
        status: 'pending',
      },
      {
        _id: '2' as Id<'topics'>,
        title: 'Completed Topic',
        order: 2,
        status: 'completed',
        finalEstimate: '5',
      },
    ]);

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="user1"
        identityId="user2"
      />
    );

    expect(screen.getByText('Pending Topic')).toBeDefined();
    expect(screen.getByText('Completed Topic')).toBeDefined();
    expect(screen.getByText('5')).toBeDefined(); // Estimate for completed topic
  });

  it('hides management controls from non-facilitators', () => {
    vi.mocked(useQuery).mockReturnValue([]);

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="facilitator-id"
        identityId="player-id"
      />
    );

    expect(screen.queryByRole('button', { name: /add topic/i })).toBeNull();
  });

  it('shows management controls to facilitators', () => {
    vi.mocked(useQuery).mockReturnValue([]);

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="facilitator-id"
        identityId="facilitator-id"
      />
    );

    // This will fail until we implement it
    expect(screen.getByRole('button', { name: /add topic/i })).toBeDefined();
  });

  it('renders empty states when there are no topics', () => {
    vi.mocked(useQuery).mockReturnValue([]);

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="user1"
        identityId="user2"
      />
    );

    expect(screen.getByText(/No topics in queue/i)).toBeDefined();
    expect(screen.getByText(/Empty history/i)).toBeDefined();
  });
});
