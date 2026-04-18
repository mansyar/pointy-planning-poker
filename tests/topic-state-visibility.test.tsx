import { render, screen } from '@testing-library/react';
import { TopicSidebar } from '../src/components/TopicSidebar';
import { describe, it, expect, vi } from 'vitest';
import { useQuery } from 'convex/react';
import type { Id } from '../convex/_generated/dataModel';

vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(() => vi.fn()),
}));

describe('TopicSidebar State Visibility', () => {
  it('applies correct classes for active topic', () => {
    vi.mocked(useQuery).mockReturnValue([
      {
        _id: '1' as Id<'topics'>,
        title: 'Active Topic',
        order: 1,
        status: 'active',
      },
    ]);

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="user1"
        identityId="user1"
        onOpenBatchAdd={vi.fn()}
      />
    );

    const activeContainer = screen.getByText('Active Topic').closest('div');
    // Check for accent border or ring class
    expect(activeContainer?.className).toContain('border-[var(--accent)]');
  });

  it('applies correct classes for completed topic', () => {
    vi.mocked(useQuery).mockReturnValue([
      {
        _id: '2' as Id<'topics'>,
        title: 'Completed Topic',
        order: 1,
        status: 'completed',
        finalEstimate: '5',
      },
    ]);

    render(
      <TopicSidebar
        roomId={'room1' as unknown as Id<'rooms'>}
        facilitatorId="user1"
        identityId="user1"
        onOpenBatchAdd={vi.fn()}
      />
    );

    const completedContainer = screen
      .getByText('Completed Topic')
      .closest('div');
    expect(completedContainer?.className).toContain('bg-[var(--bg-tertiary)]');
    expect(completedContainer?.className).toContain('opacity-');
  });
});
