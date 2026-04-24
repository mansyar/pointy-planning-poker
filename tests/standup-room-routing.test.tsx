import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StandupRoom } from '../src/components/standup/StandupRoom';
import { useQuery, useMutation } from 'convex/react';

vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

vi.mock('../src/hooks/useIdentity', () => ({
  useIdentity: () => ({
    nickname: 'Test User',
    identityId: 'user123',
    setNickname: vi.fn(),
  }),
}));

vi.mock('../src/hooks/usePresence', () => ({
  usePresence: vi.fn(),
}));

vi.mock('../src/hooks/useEmojiReactions', () => ({
  useEmojiReactions: () => ({
    localReactions: [],
    sendReaction: vi.fn(),
  }),
}));

describe('StandupRoom Component', () => {
  beforeEach(() => {
    let queryCallCount = 0;
    vi.mocked(useQuery).mockImplementation(() => {
      queryCallCount++;
      // First call is api.rooms.getBySlug
      if (queryCallCount === 1) {
        return { 
          _id: 'room1', 
          facilitatorId: 'user123', 
          slug: 'test-slug',
          standupTimeLimit: 90,
          standupAutoAdvance: false
        };
      }
      // Second call is api.players.listByRoom
      if (queryCallCount === 2) {
        return [{ identityId: 'user123', name: 'Test User', isOnline: true }];
      }
      // Third call is api.standup.listEntries
      return [];
    });
    vi.mocked(useMutation).mockReturnValue(
      Object.assign(vi.fn().mockResolvedValue({}), {
        withOptimisticUpdate: vi.fn().mockReturnThis(),
      })
    );
  });

  it('renders the standup room waiting state', () => {
    render(<StandupRoom slug="test-slug" />);
    
    expect(screen.getByText(/READY FOR SYNC?/i)).toBeDefined();
    expect(screen.getByText(/Start Standup/i)).toBeDefined();
  });

  it('shows room not found if room is null', () => {
    vi.mocked(useQuery).mockReturnValue(null);
    render(<StandupRoom slug="invalid-slug" />);
    
    expect(screen.getByText(/Room not found/i)).toBeDefined();
  });
});
