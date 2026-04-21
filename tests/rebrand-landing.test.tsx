import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { LandingPage } from '../src/components/LandingPage';
import { JuiceProvider } from '../src/components/JuiceToggle';

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(),
}));

// Mock Convex
vi.mock('convex/react', () => ({
  useMutation: vi.fn(),
}));

// Mock useIdentity
vi.mock('../src/hooks/useIdentity', () => ({
  useIdentity: vi.fn(() => ({
    nickname: 'Tester',
    setNickname: vi.fn(),
    identityId: 'test-id',
  })),
}));

const renderWithJuice = (ui: React.ReactElement) => {
  return render(<JuiceProvider initialJuice={true}>{ui}</JuiceProvider>);
};

describe('Landing Page Rebranding', () => {
  it('renders landing page with Tempo branding', () => {
    renderWithJuice(<LandingPage />);

    // Check for "Tempo" title
    expect(screen.queryByText('Tempo')).toBeTruthy();

    // Check for new tagline
    expect(screen.queryByText(/Scrum Tools for Modern Teams/i)).toBeTruthy();

    // Check that "Pointy Poker" is NO LONGER present
    expect(screen.queryByText('Pointy Poker')).toBeNull();
  });

  it('shows Poker tool with updated CTA', () => {
    renderWithJuice(<LandingPage />);
    expect(screen.getByText(/Create Poker Room/i)).toBeTruthy();
  });

  it('shows Standup tool as Coming Soon', () => {
    renderWithJuice(<LandingPage />);
    expect(screen.getByText(/Daily Standup/i)).toBeTruthy();
    expect(screen.getByText(/Coming Soon/i)).toBeTruthy();
  });
});
