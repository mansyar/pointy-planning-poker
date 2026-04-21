import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PokerCard } from '../src/components/poker/PokerCard';

describe('Neo-Brutalist Poker Cards', () => {
  it('should render card with brutal styling', () => {
    render(<PokerCard value="5" onSelect={() => {}} />);
    const card = screen.getByRole('button', { name: /Vote 5/i });
    expect(card.classList.contains('brutal-border')).toBe(true);
  });

  it('should have different background when selected', () => {
    const { rerender } = render(<PokerCard value="5" selected={false} onSelect={() => {}} />);
    let card = screen.getByRole('button', { name: /Vote 5/i });
    expect(card.classList.contains('bg-white')).toBe(true);

    rerender(<PokerCard value="5" selected={true} onSelect={() => {}} />);
    card = screen.getByRole('button', { name: /Vote 5/i });
    expect(card.classList.contains('bg-retro-yellow')).toBe(true);
  });

  it('should call onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<PokerCard value="5" onSelect={onSelect} />);
    const card = screen.getByRole('button', { name: /Vote 5/i });
    fireEvent.click(card);
    expect(onSelect).toHaveBeenCalledWith('5');
  });
});
