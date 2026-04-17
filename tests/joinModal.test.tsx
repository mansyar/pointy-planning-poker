import { render, screen, fireEvent } from '@testing-library/react';
import JoinModal from '../src/components/JoinModal';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('JoinModal component', () => {
  const mockOnJoin = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should render the room slug', () => {
    render(<JoinModal roomSlug="test-room" onJoin={mockOnJoin} />);
    expect(screen.getByText('test-room')).toBeDefined();
  });

  it('should call onJoin when the form is submitted', () => {
    render(<JoinModal roomSlug="test-room" onJoin={mockOnJoin} />);
    const input = screen.getByPlaceholderText(/e.g., Alice/i);
    const button = screen.getByRole('button', { name: /join room/i });

    fireEvent.change(input, { target: { value: 'Bob' } });
    fireEvent.click(button);

    expect(mockOnJoin).toHaveBeenCalledWith('Bob');
    expect(localStorage.getItem('pointy_nickname')).toBe('Bob');
  });
});
