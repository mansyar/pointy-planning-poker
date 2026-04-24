import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LandingPage } from '../src/components/shared/LandingPage';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNavigate } from '@tanstack/react-router';
import { useMutation } from 'convex/react';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('convex/react', () => ({
  useMutation: vi.fn(),
}));

vi.mock('../src/hooks/useIdentity', () => ({
  useIdentity: () => ({
    nickname: 'Test User',
    setNickname: vi.fn(),
    identityId: 'user123',
  }),
}));

describe('Landing Page Standup Tool', () => {
  const mockNavigate = vi.fn();
  const mockCreateRoom = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useMutation).mockReturnValue(mockCreateRoom);
    mockCreateRoom.mockResolvedValue({ slug: 'test-slug' });
  });

  it('should render the "Daily Standup" start button', () => {
    render(<LandingPage />);
    const button = screen.getByRole('button', { name: /Start Standup/i });
    expect(button).toBeDefined();
  });

  it('should call createRoom with toolType "standup" when button clicked', async () => {
    render(<LandingPage />);
    const button = screen.getByRole('button', { name: /Start Standup/i });
    
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockCreateRoom).toHaveBeenCalledWith({
        facilitatorId: 'user123',
        toolType: 'standup',
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith({
      to: '/standup/$slug',
      params: { slug: 'test-slug' },
    });
  });
});
