import { describe, it, expect, vi } from 'vitest';
import { calculateTimerState } from '../src/utils/timer';

describe('calculateTimerState', () => {
  it('should return null if no startedAt provided', () => {
    const state = calculateTimerState({
      startedAt: undefined,
      duration: undefined,
      timeLimit: 60,
      now: Date.now(),
    });
    expect(state).toBeNull();
  });

  it('should return null if neither startedAt nor duration provided', () => {
    // @ts-ignore
    const state = calculateTimerState({
      timeLimit: 60,
    });
    expect(state).toBeNull();
  });

  it('should calculate remaining time correctly for active speaker', () => {
    const now = 10000;
    const startedAt = 5000;
    const timeLimit = 60;
    const state = calculateTimerState({
      startedAt,
      now,
      timeLimit,
    });
    
    expect(state).toEqual({
      elapsed: 5,
      remaining: 55,
      isOvertime: false,
    });
  });

  it('should handle overtime correctly', () => {
    const now = 70000;
    const startedAt = 5000;
    const timeLimit = 60;
    const state = calculateTimerState({
      startedAt,
      now,
      timeLimit,
    });
    
    expect(state).toEqual({
      elapsed: 65,
      remaining: 0,
      isOvertime: true,
    });
  });

  it('should use fixed duration if provided (completed speaker)', () => {
    const now = 20000;
    const startedAt = 5000;
    const duration = 10;
    const timeLimit = 60;
    const state = calculateTimerState({
      startedAt,
      duration,
      now,
      timeLimit,
    });
    
    expect(state).toEqual({
      elapsed: 10,
      remaining: 50,
      isOvertime: false,
    });
  });
});
