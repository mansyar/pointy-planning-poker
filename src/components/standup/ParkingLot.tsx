import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';
import { Trash2, MessageSquarePlus, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ParkingLotProps {
  roomId: Id<'rooms'>;
  identityId: string;
  isFacilitator: boolean;
}

export function ParkingLot({
  roomId,
  identityId,
  isFacilitator,
}: ParkingLotProps) {
  const [newItemText, setNewItemText] = useState('');
  const items = useQuery(api.parkingLot.listByRoom, { roomId });
  const addItem = useMutation(api.parkingLot.add);
  const removeItem = useMutation(api.parkingLot.remove);

  const handleAddItem = async () => {
    if (!newItemText.trim()) return;
    try {
      await addItem({
        roomId,
        identityId,
        text: newItemText.trim(),
      });
      setNewItemText('');
      toast.success('Item added to parking lot!');
    } catch {
      toast.error('Failed to add item');
    }
  };

  const handleRemoveItem = async (id: Id<'parking_lot'>) => {
    try {
      await removeItem({ id, identityId });
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  return (
    <div className="w-full bg-white brutal-border brutal-shadow p-6 flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-2 mb-6 border-b-4 border-black pb-2">
        <MessageSquare className="w-6 h-6" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">
          Parking Lot
        </h2>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
            placeholder="ADD TO PARKING LOT..."
            className="w-full bg-white brutal-border py-4 pl-4 pr-14 text-sm font-black uppercase focus:outline-none focus:bg-retro-yellow transition-all brutal-shadow"
          />
          <button
            onClick={handleAddItem}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-black hover:text-retro-pink transition-colors"
          >
            <MessageSquarePlus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {items === undefined ? (
          <div className="animate-pulse flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 brutal-border" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 grayscale py-12">
            <MessageSquare className="w-12 h-12 mb-4" />
            <p className="font-black uppercase text-xs tracking-widest">
              Parking lot is empty
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item._id}
                className="p-4 brutal-border bg-white flex items-center justify-between gap-4 group hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all brutal-shadow"
              >
                <span className="font-bold text-sm uppercase break-words flex-1">
                  {item.text}
                </span>
                
                {isFacilitator && (
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="p-2 brutal-border bg-white hover:bg-retro-pink text-black opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
