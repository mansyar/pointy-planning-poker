import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RoomPage } from '../src/components/RoomPage';
import { JuiceProvider } from '../src/components/JuiceToggle';
import React from 'react';

// Mock useIdentity
vi.mock('../src/hooks/useIdentity', () => ({
  useIdentity: () => ({
    identityId: 'test-identity-id',
    nickname: 'Test User',
  }),
}));

// Mock convex
vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(() => vi.fn().mockResolvedValue({})),
}));

import { useQuery } from 'convex/react';

describe('RoomPage Mobile Controller Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // Mock window.innerWidth to be small (mobile)
    vi.stubGlobal('innerWidth', 375);

    // Mock queries
    vi.mocked(useQuery).mockImplementation(
      (_apiFunc: unknown, args: unknown) => {
        const a = args as Record<string, unknown>;
        if (a && a.slug !== undefined) {
          return {
            _id: 'room-123',
            slug: a.slug as string,
            facilitatorId: 'test-identity-id',
            status: 'voting',
          };
        }
        if (a && a.roomId !== undefined && a.identityId === undefined) {
          return [
            {
              _id: 'player-1',
              identityId: 'test-identity-id',
              name: 'Test User',
              isOnline: true,
            },
          ];
        }
        if (a && a.roomId !== undefined && a.identityId !== undefined) {
          return [];
        }
        return null;
      }
    );
  });

  it('should render regular UI if not synced as controller', () => {
    render(
      <JuiceProvider>
        <RoomPage slug="test-room" />
      </JuiceProvider>
    );
    // Should see regular header
    expect(screen.getByText('Planning Poker Room')).toBeDefined();
  });

  it('should render MobileController if synced as controller on mobile', () => {
    localStorage.setItem('pointy_isController', 'true');
    render(
      <JuiceProvider>
        <RoomPage slug="test-room" />
      </JuiceProvider>
    );

    // Check for "Test User" nickname which is in the mobile controller header
    expect(screen.getByText('Test User')).toBeDefined();
    // Check for "Cast your vote" which is in CardDeck when isController is true
    expect(screen.getByText(/Cast your vote/i)).toBeDefined();
  });

  it('should exit controller mode when logout is clicked', () => {
    localStorage.setItem('pointy_isController', 'true');
    render(
      <JuiceProvider>
        <RoomPage slug="test-room" />
      </JuiceProvider>
    );

    const logoutButton = screen.getByLabelText(/Exit Controller/i);
    fireEvent.click(logoutButton);

    expect(localStorage.getItem('pointy_isController')).toBeNull();
  });
});
