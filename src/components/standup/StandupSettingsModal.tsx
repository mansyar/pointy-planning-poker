import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { X, Clock, Zap } from 'lucide-react';
import { toast } from 'sonner';
import type { Id } from '../../../convex/_generated/dataModel';

interface StandupSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: Id<'rooms'>;
  identityId: string;
  initialTimeLimit?: number;
  initialAutoAdvance?: boolean;
  initialGracePeriod?: number;
}

export function StandupSettingsModal({
  isOpen,
  onClose,
  roomId,
  identityId,
  initialTimeLimit = 90,
  initialAutoAdvance = false,
  initialGracePeriod = 10,
}: StandupSettingsModalProps) {
  const [timeLimit, setTimeLimit] = useState(initialTimeLimit);
  const [autoAdvance, setAutoAdvance] = useState(initialAutoAdvance);
  const [gracePeriod, setGracePeriod] = useState(initialGracePeriod);
  const updateConfig = useMutation(api.standup.updateConfig);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      await updateConfig({
        roomId,
        identityId,
        config: {
          timeLimit,
          autoAdvance,
          gracePeriod,
        },
      });
      toast.success('Settings updated!');
      onClose();
    } catch {
      toast.error('Failed to update settings');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-md brutal-border brutal-shadow p-8 rise-in">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            Standup Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-retro-pink transition-colors brutal-border"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Time Limit */}
          <div className="space-y-3">
            <label
              htmlFor="timeLimit"
              className="flex items-center gap-2 text-sm font-black uppercase tracking-widest"
            >
              <Clock className="w-4 h-4" />
              Time Limit (Seconds)
            </label>
            <input
              id="timeLimit"
              type="number"
              min="10"
              max="600"
              step="10"
              value={timeLimit}
              onChange={(e) => setTimeLimit(parseInt(e.target.value, 10))}
              className="w-full brutal-border bg-white px-4 py-3 text-xl font-black focus:bg-retro-yellow focus:outline-none transition-all"
            />
          </div>

          {/* Grace Period */}
          <div className="space-y-3">
            <label
              htmlFor="gracePeriod"
              className="flex items-center gap-2 text-sm font-black uppercase tracking-widest"
            >
              <Clock className="w-4 h-4" />
              Grace Period (Seconds)
            </label>
            <input
              id="gracePeriod"
              type="number"
              min="0"
              max="60"
              step="5"
              value={gracePeriod}
              onChange={(e) => setGracePeriod(parseInt(e.target.value, 10))}
              className="w-full brutal-border bg-white px-4 py-3 text-xl font-black focus:bg-retro-yellow focus:outline-none transition-all"
            />
          </div>

          {/* Auto-Advance */}
          <div className="flex items-center justify-between brutal-border p-4 bg-gray-50">
            <div className="flex flex-col">
              <label
                htmlFor="autoAdvance"
                className="flex items-center gap-2 text-sm font-black uppercase tracking-widest"
              >
                <Zap className="w-4 h-4" />
                Auto-Advance
              </label>
              <span className="text-[10px] font-bold uppercase opacity-60">
                Move to next speaker automatically
              </span>
            </div>
            <input
              id="autoAdvance"
              type="checkbox"
              checked={autoAdvance}
              onChange={(e) => setAutoAdvance(e.target.checked)}
              className="w-8 h-8 brutal-border cursor-pointer accent-retro-pink"
            />
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-white text-black font-black uppercase brutal-border hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-4 bg-retro-yellow text-black font-black uppercase brutal-border brutal-shadow hover:bg-yellow-400 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
