import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StandupTimer } from '../src/components/shared/StandupTimer';

describe('StandupTimer Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render nothing if startedAt is missing', () => {
    const { container } = render(
      <StandupTimer 
        timeLimit={60}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('should show countdown if timer is started', () => {
    const startTime = Date.now();
    render(
      <StandupTimer
        startedAt={startTime}
        timeLimit={60}
      />
    );

    expect(screen.getByText('60S')).toBeDefined();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('59S')).toBeDefined();
  });

  it('should show overtime when elapsed > timeLimit', () => {
    const startTime = Date.now() - 61000;
    render(
      <StandupTimer
        startedAt={startTime}
        timeLimit={60}
      />
    );

    expect(screen.getByText('+1S')).toBeDefined();
    expect(screen.getByText('+1S').parentElement?.className).toContain('text-retro-pink');
  });

  it('should show urgency state when < 10S left', () => {
    const startTime = Date.now() - 51000; // 9s left
    const { container } = render(
      <StandupTimer
        startedAt={startTime}
        timeLimit={60}
      />
    );

    const timerSpan = screen.getByText('9S');
    expect(timerSpan.parentElement?.className).toContain('animate-pulse');
  });

  it('should update when props change', () => {
    const { rerender } = render(
      <StandupTimer
        startedAt={Date.now()}
        timeLimit={60}
      />
    );
    expect(screen.getByText('60S')).toBeDefined();

    const newStart = Date.now() - 10000;
    rerender(
      <StandupTimer
        startedAt={newStart}
        timeLimit={60}
      />
    );
    expect(screen.getByText('50S')).toBeDefined();
  });
});
