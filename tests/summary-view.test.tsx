import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SummaryView } from '../src/components/standup/SummaryView';
import { useQuery, useMutation } from 'convex/react';
import type { Id } from '../convex/_generated/dataModel';

vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

describe('SummaryView Component', () => {
  const mockEntries = [
    { identityId: 'user1', status: 'completed', duration: 45 },
  ];
  const mockPlayers = [
    { identityId: 'user1', name: 'Alice' },
  ];

  const mockReset = vi.fn();

  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue([]); // parking lot
    vi.mocked(useMutation).mockReturnValue(
      Object.assign(mockReset, { withOptimisticUpdate: vi.fn().mockReturnThis() })
    );
    
    localStorage.setItem('pointy_identityId', 'user1');
  });

  it('renders speaker stats', () => {
    render(
      <SummaryView 
        roomId={"room1" as Id<'rooms'>} 
        roomSlug="test" 
        // @ts-expect-error - Partial mock for test
        entries={mockEntries} 
        // @ts-expect-error - Partial mock for test
        players={mockPlayers} 
        onBack={() => {}} 
      />
    );
    expect(screen.getByText('Alice')).toBeDefined();
    expect(screen.getByText('45S')).toBeDefined();
  });

  it('shows empty parking lot message', () => {
    render(
      <SummaryView 
        roomId={"room1" as Id<'rooms'>} 
        roomSlug="test" 
        // @ts-expect-error - Partial mock for test
        entries={mockEntries} 
        // @ts-expect-error - Partial mock for test
        players={mockPlayers} 
        onBack={() => {}} 
      />
    );
    expect(screen.getByText(/No items recorded/i)).toBeDefined();
  });

  it('calls reset mutation when End Session is clicked', () => {
    render(
      <SummaryView 
        roomId={"room1" as Id<'rooms'>} 
        roomSlug="test" 
        // @ts-expect-error - Partial mock for test
        entries={mockEntries} 
        // @ts-expect-error - Partial mock for test
        players={mockPlayers} 
        onBack={() => {}} 
      />
    );

    fireEvent.click(screen.getByText(/End Session/i));
    expect(mockReset).toHaveBeenCalledWith(expect.objectContaining({
      roomId: 'room1',
      identityId: 'user1',
    }));
  });
});
