import { render, screen, fireEvent } from '@testing-library/react';
import { RoomPage } from '../src/components/poker/RoomPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery, useMutation } from 'convex/react';

vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

vi.mock('../src/hooks/useIdentity', () => ({
  useIdentity: () => ({ identityId: 'user-1', nickname: 'Alice' }),
}));

vi.mock('../src/hooks/useSound', () => ({
  useSound: () => ({
    play: vi.fn(),
    vibrate: vi.fn(),
    patterns: { success: [] },
  }),
}));

vi.mock('../src/hooks/usePresence', () => ({
  usePresence: vi.fn(),
}));

vi.mock('../src/hooks/useEmojiReactions', () => ({
  useEmojiReactions: () => ({ localReactions: [], sendReaction: vi.fn() }),
}));

vi.mock('../src/components/shared/JuiceToggle', () => ({
  useJuice: () => ({ enabled: true }),
}));

// Mock InviteModal
vi.mock('../src/components/shared/InviteModal', () => ({
  InviteModal: ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="invite-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

describe('RoomPage Invite Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useQuery).mockImplementation((...args) => {
      const a = args[1] as any;
      if (a?.slug === 'test-room') {
        return {
          _id: 'room-1',
          slug: 'test-room',
          facilitatorId: 'user-1',
          status: 'voting',
          currentTopicId: 'topic-1',
        };
      }
      if (a?.roomId === 'room-1') {
        // Topics list
        return [
          {
            _id: 'topic-1',
            title: 'Test Topic',
            status: 'active',
            order: 1,
          },
        ];
      }
      return []; // Default to empty array for players, votes
    });
    vi.mocked(useMutation).mockReturnValue(
      Object.assign(vi.fn().mockResolvedValue({}), {
        withOptimisticUpdate: vi.fn().mockReturnThis(),
      })
    );
  });

  it('should open InviteModal when "Copy Invite" is clicked', async () => {
    render(<RoomPage slug="test-room" />);

    const inviteButton = screen.getByRole('button', { name: /Invite/i });
    fireEvent.click(inviteButton);

    expect(await screen.findByTestId('invite-modal')).toBeDefined();
  });
});
