import type { Id } from '../../../convex/_generated/dataModel';
import { Play, Settings, Eye } from 'lucide-react';
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
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="hidden sm:block bg-black text-white px-2 py-0.5 brutal-border text-[8px] font-black tracking-widest uppercase shrink-0">
          {roomStatus === 'revealed' ? 'DONE' : 'NOW'}
        </div>
        <h2 className="text-xl sm:text-3xl font-black uppercase text-black border-b-4 border-black truncate tracking-tighter leading-none">
          {activeTopic.title}
        </h2>
      </div>

      {/* Actions Area */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="brutal-border bg-white px-2 py-1">
          <RoundTimer
            roomId={roomId}
            identityId={identityId}
            timerStartedAt={timerStartedAt}
            isFacilitator={isFacilitator}
          />
        </div>

        {isFacilitator && (
          <div className="flex items-center gap-2">
            {roomStatus === 'revealed' ? (
              <button
                onClick={onConfirmNext}
                className="brutal-btn bg-black text-white px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-retro-green hover:text-black"
              >
                <span className="hidden sm:inline">Next Topic</span>
                <Play className="w-4 h-4 sm:hidden fill-current" />
              </button>
            ) : (
              <button
                onClick={onReveal}
                disabled={revealDisabled}
                className="brutal-btn bg-white text-black px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-retro-yellow disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Reveal</span>
                <Eye className="w-4 h-4 sm:hidden" />
              </button>
            )}
          </div>
        )}

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="brutal-btn p-2 bg-white text-black hover:bg-retro-yellow"
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
