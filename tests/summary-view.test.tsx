import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SummaryView } from '../src/components/standup/SummaryView';
import { useQuery } from 'convex/react';

vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
}));

describe('SummaryView Component', () => {
  const mockEntries = [
    { identityId: 'user1', status: 'completed', duration: 45 },
  ];
  const mockPlayers = [
    { identityId: 'user1', name: 'Alice' },
  ];

  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue([]); // parking lot
  });

  it('renders speaker stats', () => {
    render(<SummaryView roomId={"room1" as any} roomSlug="test" entries={mockEntries} players={mockPlayers} onBack={() => {}} />);
    expect(screen.getByText('Alice')).toBeDefined();
    expect(screen.getByText('45S')).toBeDefined();
  });

  it('shows empty parking lot message', () => {
    render(<SummaryView roomId={"room1" as any} roomSlug="test" entries={mockEntries} players={mockPlayers} onBack={() => {}} />);
    expect(screen.getByText(/No items recorded/i)).toBeDefined();
  });
});
