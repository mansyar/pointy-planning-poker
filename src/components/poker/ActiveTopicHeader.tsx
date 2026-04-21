import type { Id } from '../../../convex/_generated/dataModel';
import { Play, CheckCircle2, Settings } from 'lucide-react';
import { RoundTimer } from './RoundTimer';

interface ActiveTopicHeaderProps {
  roomId: Id<'rooms'>;
  identityId: string;
  roomStatus: 'voting' | 'revealed';
  timerStartedAt?: number;
  activeTopic?: {
    _id: Id<'topics'>;
    title: string;
    order: number;
    status: 'pending' | 'active' | 'completed';
  };
  isFacilitator: boolean;
  onReveal: () => void;
  onConfirmNext: () => void;
  onOpenSettings?: () => void;
  revealDisabled?: boolean;
}

export function ActiveTopicHeader({
  roomId,
  identityId,
  roomStatus,
  timerStartedAt,
  activeTopic,
  isFacilitator,
  onReveal,
  onConfirmNext,
  onOpenSettings,
  revealDisabled = false,
}: ActiveTopicHeaderProps) {
  if (!activeTopic) return null;

  return (
    <header className="w-full bg-retro-pink brutal-border border-t-0 border-l-0 border-r-0 p-3 flex items-center justify-between relative shrink-0 gap-6">
      {/* Title Area */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="bg-black text-white px-2 py-0.5 brutal-border text-[8px] font-black tracking-widest uppercase shrink-0">
          {roomStatus === 'revealed' ? 'DONE' : 'NOW'}
        </div>
        <h2 className="text-3xl font-black uppercase text-black border-b-4 border-black truncate tracking-tighter leading-none">
          {activeTopic.title}
        </h2>
      </div>

      {/* Actions Area */}
      <div className="flex items-center gap-4 shrink-0">
        <RoundTimer
          roomId={roomId}
          identityId={identityId}
          timerStartedAt={timerStartedAt}
          isFacilitator={isFacilitator}
        />

        {isFacilitator && (
          <div className="flex items-center gap-2">
            {roomStatus === 'revealed' ? (
              <button
                onClick={onConfirmNext}
                className="px-4 py-2 bg-black text-white text-sm font-black uppercase brutal-border brutal-shadow hover:bg-retro-green hover:text-black hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
              >
                Next Topic
              </button>
            ) : (
              <button
                onClick={onReveal}
                disabled={revealDisabled}
                className="px-4 py-2 bg-white text-black text-sm font-black uppercase brutal-border brutal-shadow hover:bg-retro-yellow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Reveal
              </button>
            )}
          </div>
        )}

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="p-2 brutal-border bg-white text-black hover:bg-retro-yellow transition-all brutal-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>

      {roomStatus === 'voting' && revealDisabled && (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 z-20">
            <p className="text-[8px] font-black uppercase tracking-[0.2em] bg-white text-black px-2 brutal-border">
              Waiting for votes...
            </p>
        </div>
      )}
    </header>
  );
}
