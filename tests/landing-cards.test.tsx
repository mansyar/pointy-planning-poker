import { render, screen } from '@testing-library/react';
import { LandingPage } from '../src/components/LandingPage';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('../hooks/useIdentity', () => ({
  useIdentity: vi.fn(() => ({
    nickname: '',
    setNickname: vi.fn(),
    identityId: 'user1',
  })),
}));

vi.mock('convex/react', () => ({
  useMutation: vi.fn(() => vi.fn()),
}));

describe('LandingPage Feature Cards', () => {
  it('renders all feature highlight cards', () => {
    render(<LandingPage />);
    expect(screen.getByText('Real-time')).toBeDefined();
    expect(screen.getByText('Fibonacci Scale')).toBeDefined();
    expect(screen.getByText('Ephemeral')).toBeDefined();
  });
});
