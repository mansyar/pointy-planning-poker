import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SpeakerQueue } from '../src/components/shared/SpeakerQueue';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import type { Id } from '../convex/_generated/dataModel';

vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

describe('SpeakerQueue Component', () => {
  const roomId = 'room1' as Id<'rooms'>;
  const myIdentityId = 'user1';

  const mockEntries = [
    { _id: 'e1' as any, identityId: 'user1', order: 0, status: 'completed', duration: 30 },
    { _id: 'e2' as any, identityId: 'user2', order: 1, status: 'speaking', startedAt: Date.now() },
    { _id: 'e3' as any, identityId: 'user3', order: 2, status: 'pending' },
  ];

  const mockPlayers = [
    { identityId: 'user1', name: 'Alice' },
    { identityId: 'user2', name: 'Bob' },
    { identityId: 'user3', name: 'Charlie' },
  ];

  const mockNext = vi.fn();
  const mockPrev = vi.fn();
  const mockSkip = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    let queryCallCount = 0;
    vi.mocked(useQuery).mockImplementation(() => {
      queryCallCount++;
      if (queryCallCount % 2 === 1) return mockEntries;
      return mockPlayers;
    });

    let mutationCallCount = 0;
    vi.mocked(useMutation).mockImplementation(() => {
      mutationCallCount++;
      if (mutationCallCount === 1) return mockNext;
      if (mutationCallCount === 2) return mockPrev;
      if (mutationCallCount === 3) return mockSkip;
      return vi.fn();
    });
  });

  it('renders entries with player names', () => {
    render(<SpeakerQueue roomId={roomId} myIdentityId={myIdentityId} facilitatorId="user1" />);
    
    expect(screen.getByText('Alice')).toBeDefined();
    expect(screen.getByText('Bob')).toBeDefined();
    expect(screen.getByText('Charlie')).toBeDefined();
  });

  it('shows facilitator controls if is facilitator', () => {
    render(<SpeakerQueue roomId={roomId} myIdentityId="user1" facilitatorId="user1" />);
    
    expect(screen.getByTitle('Previous Speaker')).toBeDefined();
    expect(screen.getByTitle('Skip Speaker')).toBeDefined();
    expect(screen.getByTitle('Next Speaker')).toBeDefined();
  });

  it('does not show facilitator controls if not facilitator', () => {
    render(<SpeakerQueue roomId={roomId} myIdentityId="user2" facilitatorId="user1" />);
    
    expect(screen.queryByTitle('Next Speaker')).toBeNull();
  });

  it('calls next mutation when next button is clicked', () => {
    render(<SpeakerQueue roomId={roomId} myIdentityId="user1" facilitatorId="user1" />);
    
    const nextButton = screen.getByTitle('Next Speaker');
    fireEvent.click(nextButton);
    
    expect(mockNext).toHaveBeenCalled();
  });

  it('calls prev mutation when prev button is clicked', () => {
    render(<SpeakerQueue roomId={roomId} myIdentityId="user1" facilitatorId="user1" />);
    
    const prevButton = screen.getByTitle('Previous Speaker');
    fireEvent.click(prevButton);
    
    expect(mockPrev).toHaveBeenCalled();
  });

  it('calls skip mutation when skip button is clicked', () => {
    render(<SpeakerQueue roomId={roomId} myIdentityId="user1" facilitatorId="user1" />);
    
    const skipButton = screen.getByTitle('Skip Speaker');
    fireEvent.click(skipButton);
    
    expect(mockSkip).toHaveBeenCalled();
  });
});
