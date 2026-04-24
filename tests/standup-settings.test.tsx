import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StandupSettingsModal } from '../src/components/standup/StandupSettingsModal';
import { useMutation } from 'convex/react';

vi.mock('convex/react', () => ({
  useMutation: vi.fn(),
}));

describe('StandupSettingsModal', () => {
  const mockUpdateConfig = vi.fn();

  beforeEach(() => {
    vi.mocked(useMutation).mockReturnValue(mockUpdateConfig);
  });

  it('renders with initial values', () => {
    render(
      <StandupSettingsModal 
        isOpen={true} 
        onClose={vi.fn()} 
        roomId="room1" as any
        identityId="user1"
        initialTimeLimit={60}
        initialAutoAdvance={true}
      />
    );
    
    expect(screen.getByLabelText(/Time Limit/i)).toBeDefined();
    expect((screen.getByLabelText(/Time Limit/i) as HTMLInputElement).value).toBe('60');
    expect((screen.getByLabelText(/Auto-Advance/i) as HTMLInputElement).checked).toBe(true);
  });

  it('calls update mutation on save', () => {
    render(
      <StandupSettingsModal 
        isOpen={true} 
        onClose={vi.fn()} 
        roomId="room1" as any
        identityId="user1"
        initialTimeLimit={60}
        initialAutoAdvance={true}
      />
    );

    fireEvent.change(screen.getByLabelText(/Time Limit/i), { target: { value: '90' } });
    fireEvent.click(screen.getByText(/Save Changes/i));

    expect(mockUpdateConfig).toHaveBeenCalledWith({
      roomId: 'room1',
      identityId: 'user1',
      config: {
        timeLimit: 90,
        autoAdvance: true,
      }
    });
  });
});
