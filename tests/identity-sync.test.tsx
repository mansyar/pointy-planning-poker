import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useIdentity } from '../src/hooks/useIdentity';

// Mock convex
vi.mock('convex/react', () => ({
  useMutation: vi.fn(),
}));

import { useMutation } from 'convex/react';

describe('useIdentity sync logic', () => {
  const mockVerifySyncToken = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.mocked(useMutation).mockReturnValue(mockVerifySyncToken);

    // Mock window.location
    const originalLocation = window.location;
    // @ts-expect-error - window.location is read-only
    delete window.location;
    window.location = {
      ...originalLocation,
      search: '',
      pathname: '/room/test-room',
    } as Location;
  });

  it('should not sync if no sync token in URL', async () => {
    renderHook(() => useIdentity());
    expect(mockVerifySyncToken).not.toHaveBeenCalled();
  });

  it('should call sync:verify if sync token is present in URL', async () => {
    window.location.search = '?sync=test-token-123';
    mockVerifySyncToken.mockResolvedValue('synced-identity-id');

    const { result } = renderHook(() => useIdentity());

    await waitFor(() => {
      expect(mockVerifySyncToken).toHaveBeenCalledWith({
        token: 'test-token-123',
      });
    });

    await waitFor(() => {
      expect(result.current.identityId).toBe('synced-identity-id');
    });

    expect(localStorage.getItem('pointy_identityId')).toBe(
      'synced-identity-id'
    );
  });
});
