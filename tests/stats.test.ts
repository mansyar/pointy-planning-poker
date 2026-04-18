import { describe, it, expect } from 'vitest';
import { calculateStats, identifyOutliers } from '../src/utils/stats';

describe('calculateStats', () => {
  it('calculates stats for a simple numeric array', () => {
    const votes = [1, 2, 3, 5, 8];
    const stats = calculateStats(votes);
    expect(stats.average).toBe(3.8);
    expect(stats.median).toBe(3);
    expect(stats.mode).toEqual([1, 2, 3, 5, 8]); // All are unique
  });

  it('calculates mode correctly', () => {
    const votes = [3, 5, 5, 8];
    const stats = calculateStats(votes);
    expect(stats.mode).toEqual([5]);
  });

  it('handles non-numeric values by ignoring them', () => {
    const votes = [3, 5, '?', '☕', 8];
    const stats = calculateStats(votes);
    expect(stats.average).toBe(5.33); // (3+5+8)/3
    expect(stats.count).toBe(3);
  });
});

describe('identifyOutliers', () => {
  it('identifies min and max outliers', () => {
    const votes = [1, 5, 5, 5, 13];
    const outliers = identifyOutliers(votes);
    expect(outliers.min).toContain(1);
    expect(outliers.max).toContain(13);
  });

  it('returns empty if all are same', () => {
    const votes = [5, 5, 5];
    const outliers = identifyOutliers(votes);
    expect(outliers.min).toEqual([]);
    expect(outliers.max).toEqual([]);
  });
});
