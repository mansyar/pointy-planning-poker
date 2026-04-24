import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ParkingLot } from '../src/components/standup/ParkingLot';
import { useQuery, useMutation } from 'convex/react';
import type { Id } from '../convex/_generated/dataModel';

vi.mock('convex/react', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

describe('ParkingLot Component', () => {
  const mockItems = [
    { _id: 'i1', text: 'Item 1', identityId: 'user1' },
  ];

  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue(mockItems);
    vi.mocked(useMutation).mockReturnValue(
      Object.assign(vi.fn(), { withOptimisticUpdate: vi.fn().mockReturnThis() })
    );
  });

  it('renders items', () => {
    render(
      <ParkingLot 
        roomId={"room1" as Id<'rooms'>} 
        identityId="user1" 
        isFacilitator={false} 
      />
    );
    expect(screen.getByText('Item 1')).toBeDefined();
  });

  it('shows add input', () => {
    render(
      <ParkingLot 
        roomId={"room1" as Id<'rooms'>} 
        identityId="user1" 
        isFacilitator={false} 
      />
    );
    expect(screen.getByPlaceholderText(/Add to parking lot/i)).toBeDefined();
  });

  it('calls add mutation on enter', () => {
    const addMock = vi.fn();
    vi.mocked(useMutation).mockReturnValue(
      Object.assign(addMock, { withOptimisticUpdate: vi.fn().mockReturnThis() })
    );

    render(
      <ParkingLot 
        roomId={"room1" as Id<'rooms'>} 
        identityId="user1" 
        isFacilitator={false} 
      />
    );
    
    const input = screen.getByPlaceholderText(/Add to parking lot/i);
    fireEvent.change(input, { target: { value: 'New Item' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(addMock).toHaveBeenCalledWith(expect.objectContaining({
      text: 'New Item',
    }));
  });
});
