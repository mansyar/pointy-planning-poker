import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
// I'll create this file next
import { useIdentity } from '../src/hooks/useIdentity';

describe('useIdentity hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should generate a unique identityId if none exists', () => {
    const { result } = renderHook(() => useIdentity());
    expect(result.current.identityId).toBeDefined();
    expect(typeof result.current.identityId).toBe('string');
    expect(localStorage.getItem('pointy_identityId')).toBe(result.current.identityId);
  });

  it('should load existing identityId from localStorage', () => {
    const existingId = 'test-id';
    localStorage.setItem('pointy_identityId', existingId);
    const { result } = renderHook(() => useIdentity());
    expect(result.current.identityId).toBe(existingId);
  });

  it('should save and load nickname', () => {
    const { result } = renderHook(() => useIdentity());
    act(() => {
      result.current.setNickname('Alice');
    });
    expect(result.current.nickname).toBe('Alice');
    expect(localStorage.getItem('pointy_nickname')).toBe('Alice');
  });
});
